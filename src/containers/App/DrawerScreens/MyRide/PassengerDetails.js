import EmptyComponent from '#components/common/EmptyComponent';
import Loader from '#components/common/Loader';
import Typography from '#components/common/Typography';
import { Service } from '#config/service';
import { colors } from '#res/colors';
import { showPopUpMessage } from '#util/';
import { getAge } from '#util/';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native';
import { View, StyleSheet } from 'react-native';

const _keyExtractor = (item, index) => `passenger${index}`;

const PassengerDetails = ({ navigation: { navigate }, route: { params: { ride } } }) => {

    const [passengers, setPassengers] = useState(ride.passengers);
    const [reviewParams, setReviewParams] = useState([]);

    const [loading, setLoading] = useState(false);
    const [currentPassenger, setCurrentPassenger] = useState({});

    const reviewButtonPressHandler = _currentPassenger => {
        setCurrentPassenger(_currentPassenger);
        navigate('Review', { reviewParams, reviewId: _currentPassenger?.reviews?.[0]?.review_id, submitHandler: submitReviewHandler });
    };

    const submitReviewHandler = async ({ reviewText = '', reviewParams: updatedReviewParams = {} }) => {
        try {
            setLoading(true);
            const reviewObj = {
                review: reviewText,
                receiver_id: currentPassenger.id,
                ride_id: ride.ride_id,
                ratings: JSON.stringify(updatedReviewParams),
            };
            const { status, message, data: { review_id } } = await Service.postReview(reviewObj);
            if (status) {
                const updatedPassengers = passengers.map(passenger => passenger.id === currentPassenger.id ? { ...passenger, reviews: [{ review_id }] } : passenger);
                setPassengers(updatedPassengers);
                showPopUpMessage('Success', message, 'success');
            } else {
                showPopUpMessage('Failed', 'Something went wrong', 'danger');
            }
        } catch (error) {
            console.trace('Inside Catch => ', error);
            showPopUpMessage('Failed', typeof error === 'string' ? error : 'Something went wrong', 'danger');
        } finally {
            setLoading(false);
            getReviewParams();
        }
    };


    const getReviewParams = async () => {
        try {
            const { data } = await Service.getReviewParams({ type: 'passenger' });
            setReviewParams(data);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getReviewParams();
    }, []);



    const _renderItem = ({ item, index }) => {
        const { // cell_no,
            name, gender, dateOfBirth, profession } = item;

        return (
            <View style={styles.item}>
                <View style={styles.row}>
                    <Typography variant="semiBold" >Name</Typography>
                    <Typography variant="semiBold" >{name}</Typography>
                </View>
                {/* <View style={styles.row}>
                    <Typography variant="semiBold" >Cell Number</Typography>
                    <Typography variant="semiBold" >{cell_no}</Typography>
                </View> */}
                <View style={styles.row}>
                    <Typography variant="semiBold" >Gender</Typography>
                    <Typography variant="semiBold" >{gender}</Typography>
                </View>
                <View style={styles.row}>
                    <Typography variant="semiBold" >Age</Typography>
                    <Typography variant="semiBold" >{getAge(dateOfBirth)}</Typography>
                </View>
                <View style={styles.row}>
                    <Typography variant="semiBold" >Profession</Typography>
                    <Typography variant="semiBold" >{profession}</Typography>
                </View>
                {
                    ride.status === 'Completed' &&
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { backgroundColor: item.reviews?.length ? colors.secondaryGreen : colors.warning },
                            { alignSelf: 'flex-end', marginRight: responsiveWidth(2), marginVertical: responsiveHeight(1) },
                        ]}
                        onPress={reviewButtonPressHandler.bind(this, item)}
                    >
                        <Typography size={10} variant="small" color={colors.white}>
                            {item.reviews?.length ? 'See Review' : 'Give Review'}
                        </Typography>
                    </TouchableOpacity>
                }
            </View>
        );
    };

    return (
        <>
            {loading && <Loader />}
            <FlatList
                data={passengers}
                renderItem={_renderItem}
                keyExtractor={_keyExtractor}
                ListEmptyComponent={() => <EmptyComponent title="No Passenger found" loading={loading} />}
                contentContainerStyle={styles.root}
            />
        </>
    );
};

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
    },
    item: {
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 5,
        borderRadius: 10,
        margin: 10,
    },
    row: {
        marginVertical: responsiveHeight(0.5),
        marginHorizontal: responsiveWidth(4),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: responsiveHeight(0.8),
        paddingHorizontal: responsiveWidth(1),
        marginHorizontal: responsiveWidth(0.5),
        width: responsiveWidth(18),
        alignItems: 'center',
    },

});

export default PassengerDetails;
