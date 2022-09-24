import Button from '#components/common/Button';
import LoaderView from '#components/common/LoaderView';
import Radio from '#components/common/Radio';
import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import { getFonts, width } from '#util/index';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import images from '#assets/index';
import { Image } from 'react-native';
import { ScrollView } from 'react-native';

const BookModal = ({
    loading,
    modalResponseType,
    setModalResponseType,
    modalMessage,
    bookingType,
    currentRide = {},
    bookingTypeCheckHandler,
    setVisible,
    bookRideHandler,
    selectedSeats,
    setSelectedSeats,
}) => {

    const { capacity, full_ride, seating_capacity } = currentRide;

    var updatedSeatOrder = [...currentRide.seat_orders];
    updatedSeatOrder.splice(1, 0, { type_id: 3 });

    const setSelectedSeatsHandler = _index => {
        var updatedSelectedSeats = [...selectedSeats];
        const alreadyExistsIndex = updatedSelectedSeats.findIndex(item => item === _index);
        if (alreadyExistsIndex === -1) {
            updatedSelectedSeats.push(_index);
        } else {
            updatedSelectedSeats = updatedSelectedSeats.filter(item => item !== _index);
        }
        setSelectedSeats(updatedSelectedSeats);
    };

    return (
        <View style={styles.modalView}>
            {loading ?
                <View style={{ height: responsiveHeight(20) }}>
                    <LoaderView />
                </View>
                :
                modalResponseType ?
                    <View style={{ height: responsiveHeight(30), justifyContent: 'center', alignItems: 'center' }}>
                        <LottieView style={{ width: responsiveHeight(10), height: responsiveHeight(10) }}
                            source={images[modalResponseType]} autoPlay loop={false} />
                        <Typography style={{
                            width: width * 0.8,
                            textAlign: 'center',
                            marginVertical: 12,
                        }}>
                            {modalMessage ? modalMessage : 'Your request has been sent to the driver. Hold tight! you will get a response soon.'}
                        </Typography>
                        <Button onPress={() => { setVisible(false); setModalResponseType(false); }}
                            style={{
                                width: responsiveWidth(50), margin: 2,
                                backgroundColor: modalResponseType === 'success' ? colors.secondaryGreen : colors.warning,
                            }}
                            title="OK" />
                    </View>
                    : <>
                        <View style={{ marginHorizontal: responsiveWidth(2) }} >
                            <Typography variant="bold" lineHeight={40}>Book Ride</Typography>
                        </View>
                        <View style={styles.row}>
                            <Typography style={{ flex: 1, marginLeft: responsiveWidth(2) }} >
                                <Typography size={14} variant="semiBold">Total: </Typography>
                                <Typography size={14} variant="bold">{seating_capacity + '\t\t'}</Typography>
                                <Typography size={14} variant="semiBold">Available: </Typography>
                                <Typography size={14} variant="bold">{full_ride || +capacity === 0 ? 'Fully Booked' : capacity}</Typography>
                            </Typography>
                        </View>
                        <View style={[styles.row, styles.radioView]} >

                            <View >
                                <Radio
                                    type="checkbox"
                                    label="Full Car"
                                    disabled={full_ride || +capacity < +seating_capacity}
                                    description={`${currentRide.price_full_vehicle ?? 0} Rs`}
                                    selected={bookingType === 'full-ride'}
                                    onPress={bookingTypeCheckHandler.bind(this, 'full-ride')} />
                                {
                                    full_ride || +capacity < +seating_capacity &&
                                    <Typography size={10} variant="semiBold" color={colors.warning}
                                        style={{ marginLeft: responsiveWidth(10) }}>
                                        Not available, seats booked
                                    </Typography>
                                }
                            </View>
                        </View>
                        {
                            bookingType === 'full-ride' ? null :
                                <ScrollView contentContainerStyle={styles.seatingOrderContainerView} style={styles.seatingOrderView}>
                                    {
                                        updatedSeatOrder.map((item, index) => {
                                            const selected = selectedSeats.some(_selected => _selected === index);
                                            return (
                                                <TouchableOpacity
                                                    key={`seatingOrder${index}`}
                                                    activeOpacity={1}
                                                    disabled={item.type_id !== 1 || item.user_id}
                                                    style={[
                                                        styles.item,
                                                        selected && { backgroundColor: colors.secondaryGreen },
                                                    ]}
                                                    onPress={setSelectedSeatsHandler.bind(this, index)}
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
                                                                    +item.type_id === 4 ? 'Not Available' :
                                                                        item.user_id ? 'Booked' : 'Available'
                                                        }
                                                    </Typography>
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                                </ScrollView>
                        }

                        <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                            <Button onPress={setVisible.bind(this, false)} style={{ flex: 1, margin: 2, backgroundColor: colors.warning }} title="Cancel" />
                            <Button onPress={bookRideHandler} style={{ flex: 1, margin: 2, backgroundColor: colors.primary }} title="Book" />
                        </View>
                    </>
            }
        </View>
    );
};


const styles = StyleSheet.create({
    modalView: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 10,
        paddingVertical: 10,
    },
    row: {
        flexDirection: 'row',
        // alignItems: 'center',
    },
    inputView: {
        marginTop: responsiveHeight(0.8),
    },
    inputStyle: {
        padding: 0,
        paddingLeft: 10,
        fontSize: 12,
        fontFamily: getFonts().semiBold,
        color: colors.primary,
    },
    inputContainerStyle: {
        borderWidth: 0.5,
        borderRadius: 10,
        backgroundColor: colors.white,
    },
    radioView: {
        marginVertical: responsiveHeight(1),
    },
    seats: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: colors.white,
        elevation: 5,
        marginHorizontal: responsiveWidth(2),
        width: '45%',
        padding: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    seatingCapacityStyling: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    seatingOrderView: {
        marginVertical: responsiveHeight(1),
        maxHeight: responsiveHeight(30),
    },
    seatingOrderContainerView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    item: {
        borderRadius: 12,
        minWidth: responsiveWidth(40),
        margin: responsiveWidth(1),
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        padding: responsiveWidth(3),
    },
    editItem: {
        backgroundColor: colors.lightGray,
    },
});

export default BookModal;
