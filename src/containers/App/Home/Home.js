import images from '#assets/index';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addnotificationdata, updateridedata } from '#redux/actions/actionCreators';
import { Service } from '#config/service';
import LoaderView from '#components/common/LoaderView';
import Button from '#components/common/Button';
import { updateReducer } from '#util/index';
import styles from './home.styles';
import Header from './Header';
import HomeButton from './HomeButton';
import globalStyles from '#res/global.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { responsiveHeight } from '#util/responsiveSizes';

const homeButtons = [
    { key: 'homeButton1', image: images.ic_create_ride, fullWidth: false, screen: 'Create Ride' },
    { key: 'homeButton2', image: images.ic_book_ride, fullWidth: false, screen: 'Book Ride' },
    { key: 'homeButton3', image: images.ic_ask_transport, fullWidth: true, screen: 'Book Transporter' },
];

const Home = ({ navigation }) => {

    const { bottom } = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState(null);
    const [rideId, setRideId] = useState(null);

    const dispatch = useDispatch();
    const addNotificationData = (data) => dispatch(addnotificationdata(data));
    const updateRideData = (data) => dispatch(updateridedata(data));
    const {
        notificationReducer: { unread },
        userReducer: { userData: { name } },
        rideReducer: { status: rideStatus },
    } = useSelector(state => state);

    const activeRidePressHandler = () => {
        navigation.navigate('Active Ride', { userType, rideId });
    };

    const notificationIconPressHandler = () => {

        navigation.navigate('Notifications', { getNotifications });
    };

    const getNotifications = async () => {
        try {
            const { data: _data, unread: _unread } = await Service.getNotifications();
            let obj = { unread: _unread, notifications: _data };
            addNotificationData(obj);
        } catch (error) {

        }
    };

    const checkActiveRide = async () => {
        try {
            setLoading(true);
            const { data } = await Service.checkActiveRide();
            if (data) {
                setUserType('driver');
                updateReducer('status', data, updateRideData);
            }
            else {
                await checkPassengerActiveRide();
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const checkPassengerActiveRide = async () => {
        try {
            setLoading(true);
            const { data, ride_id } = await Service.checkPassengerActiveRide();
            if (data) {
                setUserType('passenger');
                setRideId(ride_id);
                updateReducer('status', data, updateRideData);
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const init = async () => {
        try {
            setLoading(true);
            await getNotifications();
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rideStatus]);

    useEffect(() => {
        checkActiveRide();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rideStatus]);


    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    return (
        loading ? <LoaderView /> :
            <View style={styles.screen}>
                <Header
                    name={name}
                    notificationIconPressHandler={notificationIconPressHandler}
                    unread={unread}
                    navigation={navigation}
                />
                <View style={styles.body}>
                    <View style={StyleSheet.absoluteFill}>
                        <Image source={images.full_bg} resizeMode="contain" style={globalStyles.image} />
                    </View>
                    <View style={styles.homeButtonsContainer} >
                        {homeButtons.map(button => (<HomeButton navigation={navigation} {...button} />))}
                    </View>
                    {
                        rideStatus !== 'Active' && rideStatus !== 'Progress' ? null :
                            <Button
                                title="You have an active ride"
                                style={[styles.alertButton, { marginBottom: bottom || responsiveHeight(1) }]}
                                onPress={activeRidePressHandler}
                            />
                    }
                </View>
            </View>
    );
};
export default Home;
