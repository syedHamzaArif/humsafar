import LoaderView from '#components/common/LoaderView';
import Typography from '#components/common/Typography';
import { Service } from '#config/service';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { getAge, getValue, showPopUpMessage } from '#util/index';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { colors } from '#res/colors';
import Button from '#components/common/Button';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import Config from 'react-native-config';
import moment from 'moment';
import { Image } from 'react-native';
import images from '#assets/';

const NotificationDetails = ({ navigation: { goBack }, route: { params: { data, from } } }) => {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({});
    const [travelData, setTravelData] = useState({});
    const { userData: { id: userId } } = useSelector(state => state.userReducer);

    const { type, booking_type, date, time, transporter_id, ride_id, number_of_seats, seat_order } = data;

    var parsedSeatOrder = [];
    if (seat_order) parsedSeatOrder = JSON.parse(seat_order);

    var updatedNumberOfSeats = number_of_seats;
    try {
        if (updatedNumberOfSeats) updatedNumberOfSeats = JSON.parse(number_of_seats);
    } catch (error) {
        updatedNumberOfSeats = number_of_seats;
    }

    const rejectRequestHandler = async () => {
        try {
            setLoading(true);
            const body = {
                ride_id: data.ride_id || data.transporter_id,
                passenger_id: data.sender_id,
            };
            await Service.rejectRideBooking(body);
            showPopUpMessage('Success', 'Rejected request of passenger', 'success');
            goBack();

        } catch (error) {
            console.trace('Inside Catch => ', error);
            showPopUpMessage('Failed', typeof error === 'string' ? error : 'Something went wrong', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const acceptRequestHandler = async () => {
        try {
            setLoading(true);
            if (type === 'ride-request') {
                const body = {
                    ride_id: data.ride_id,
                    passenger_id: data.sender_id,
                    booking_type,
                };
                if (booking_type === 'custom-seats') {
                    body.seat_order = seat_order;
                }
                await Service.acceptRideBooking(body);
            } else {
                const transporterObj = {
                    transporter_id, passenger_id: data.sender_id,
                    date: JSON.parse(date), time: JSON.parse(time),
                    booking_type,
                };
                if (booking_type === 'custom-seats') {
                    transporterObj.seat_order = seat_order;
                }
                await Service.acceptTransportBooking(transporterObj);
            }
            showPopUpMessage('Success', 'Successful', 'success');
            goBack();

        } catch (error) {
            console.trace('Inside Catch => ', error);
            showPopUpMessage('Failed', typeof error === 'string' ? error : 'Something went wrong', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const init = async () => {
        try {
            setLoading(true);
            switch (type) {
                case 'ride-request':
                    const { data: _ride } = await Service.getRide(ride_id);
                    var updatedSeatOrder = _ride.seat_orders;
                    updatedSeatOrder.splice(1, 0, { type_id: 3 });
                    setTravelData(_ride);
                    const { data: requestUser } = await Service.getUser(data.sender_id, false);
                    setProfile(requestUser);
                    break;
                case 'transport-request':
                    const { data: _transport } = await Service.getTransport(transporter_id);
                    setTravelData(_transport);
                    const { data: transportRequestUser } = await Service.getUser(data.sender_id, false);
                    setProfile(transportRequestUser);

                    break;
                case 'ride-request-accept':
                case 'ride-request-reject':
                case 'ride-started':
                case 'ride-completed':
                case 'ride-cancelled':
                    const { data: acceptUser } = await Service.getUser(data.sender_id, true);
                    setProfile(acceptUser);
                    break;

                default: return;
            }
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        loading ? <LoaderView /> :
            <ScrollView contentContainerStyle={styles.root} >
                {/* <TravelCard
                    item={travelData}
                    userId={userId}
                    // detailPressHandler={() => navigate('Ride Details', { item, itemPressHandler: itemPressHandler.bind(this, item) })}
                    detailPressHandler={() => null}
                    itemPressHandler={() => null}
                /> */}

                {
                    booking_type !== 'full-ride' ? null :
                        <View style={styles.item} >
                            <Typography variant="semiBold">Request for: </Typography>
                            <Typography variant="semiBold">Full Vehicle</Typography>
                        </View>
                }
                {
                    !date ? null :
                        <View style={styles.item} >
                            <Typography variant="semiBold">Date: </Typography>
                            <Typography variant="semiBold">{JSON.parse(date)}</Typography>
                        </View>
                }
                {
                    !time ? null :
                        <View style={styles.item} >
                            <Typography variant="semiBold">Time: </Typography>
                            <Typography variant="semiBold">{JSON.parse(time)}</Typography>
                        </View>
                }
                {
                    travelData?.from_city &&
                    <View style={styles.item} >
                        <Typography variant="semiBold">Route: </Typography>
                        <Typography variant="semiBold">{`${travelData?.from_city} to ${travelData?.to_city}`}</Typography>
                    </View>
                }
                {
                    travelData?.ride_date &&
                    <>
                        <View style={styles.item} >
                            <Typography variant="semiBold">Date: </Typography>
                            <Typography variant="semiBold">{`${moment(travelData.ride_date).format('DD-MM-YYYY')}`}</Typography>
                        </View>
                        <View style={styles.item} >
                            <Typography variant="semiBold">Time: </Typography>
                            <Typography variant="semiBold">{`${travelData?.ride_time.substring(0, 5)}`}</Typography>
                        </View>
                    </>
                }
                {
                    Object.entries(profile).map(([key, value], index) => {
                        return (
                            key.includes('id') || key === 'status' || !value || key === 'cell_no' ? null :
                                <View key={`userDetails${index}`} style={styles.item} >
                                    {
                                        key.includes('image') ?
                                            <FastImage resizeMode="contain"
                                                source={{ uri: Config.SERVER + value }}
                                                style={{ width: responsiveWidth(15), height: responsiveWidth(15) }} /> :
                                            <>
                                                <Typography variant="semiBold">{key === 'dateOfBirth' ? 'Age' : getValue(key)}: </Typography>
                                                <Typography variant="semiBold">
                                                    {key === 'reg_num' ? value :
                                                        key === 'dateOfBirth' ? getAge(value) :
                                                            getValue(value)}
                                                </Typography>
                                            </>
                                    }
                                </View>
                        );
                    })
                }
                {
                    booking_type === 'full-ride' ? null :
                        <View style={styles.seatingOrderView}>
                            {
                                travelData?.seat_orders?.map?.((item, index) => {
                                    const selected = parsedSeatOrder.some(_selected => _selected === index);
                                    return (
                                        <View
                                            key={`seatingOrder${index}`}
                                            style={[
                                                styles.seatItem,
                                                selected && { backgroundColor: colors.secondaryGreen },
                                            ]}
                                        >
                                            <Image source={images.carSeat}
                                                style={{
                                                    width: 50, height: 80,
                                                    tintColor:
                                                        selected ? colors.white :
                                                            item.type_id === 1 && !item.user_id ? colors.secondaryGreen :
                                                                item.type_id === 2 ? colors.primaryOrange :
                                                                    item.type_id === 3 || item.user_id ? colors.warning :
                                                                        colors.black,
                                                }}
                                                resizeMode="contain" />
                                            <Typography variant="semiBold" size={12}
                                                color={selected ? colors.white : colors.textPrimary} >
                                                {
                                                    +item.type_id === 2 ? 'With Driver' :
                                                        +item.type_id === 3 ? 'Driver' :
                                                            selected ? 'Requested' :
                                                                item.user_id ? 'Booked' : 'Available'
                                                }
                                            </Typography>
                                        </View>
                                    )
                                })
                            }
                        </View>
                }
                {
                    (from === 'notification' || from === 'home') && (type === 'ride-request' || type === 'transport-request') ?
                        <View style={{ flexDirection: 'row', marginTop: responsiveHeight(2), alignItems: 'center' }} >
                            <Button buttonType="outline"
                                onPress={rejectRequestHandler}
                                style={{ flex: 1, margin: 2, borderColor: colors.warning }}
                                title="Reject"
                            />
                            <Button buttonType="outline"
                                onPress={goBack}
                                style={{ flex: 1, margin: 2, borderColor: colors.buttonGray }}
                                title="Later"
                            />
                            <Button buttonType="outline"
                                onPress={acceptRequestHandler}
                                style={{ flex: 1, margin: 2, borderColor: colors.primary }}
                                title="Accept"
                            />
                        </View>
                        :
                        <Button buttonType="outline"
                            onPress={goBack}
                            style={{ borderColor: colors.warning }}
                            title="Go Back"
                        />

                }
            </ScrollView>
    );
};

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        padding: responsiveHeight(2),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: responsiveHeight(1),
    },
    seatingOrderView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: responsiveHeight(1),
    },
    seatItem: {
        borderRadius: 12,
        minWidth: responsiveWidth(40),
        margin: responsiveWidth(1),
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        padding: responsiveWidth(3),
    },

});

export default NotificationDetails;
