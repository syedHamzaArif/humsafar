import Button from '#components/common/Button';
import LoaderView from '#components/common/LoaderView';
import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import images from '#assets/';
import { width } from '#util/';
import Radio from '#components/common/Radio';
import { getFonts } from '#util/';
import { Image } from 'react-native';
import { getValue } from '#util/';
import { ScrollView } from 'react-native';

const BookTransportModal = ({
    currentRide, showDatepicker, showTimePicker, date, time, setVisible, bookRideHandler,
    loading, modalResponseType, setModalResponseType, modalMessage,
    bookingType, bookingTypeCheckHandler,
    seatingOrder, setSeatingOrder, selectedSeats, setSelectedSeats,
}) => {
    const { capacity, full_ride, seating_capacity } = currentRide;

    return (
        <View style={styles.modalView}>

            {loading ?
                <View style={{ height: responsiveHeight(20) }}>
                    <LoaderView />
                </View>
                :
                <>
                    {
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
                                <View style={{ marginHorizontal: responsiveWidth(2), marginVertical: responsiveHeight(1) }} >
                                    <Typography variant="bold" lineHeight={30}>Book Ride</Typography>
                                    <Typography>When do you want to travel to {currentRide.to_city}?</Typography>
                                </View>
                                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                                    <TouchableOpacity style={styles.dateTimeStyle} activeOpacity={0.9} onPress={showDatepicker}>
                                        <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: 8 }]}>
                                            <Typography variant="semiBold">Date</Typography>
                                            <Typography color={colors.textLight} variant="semiBold">{date ? date : 'MM/DD'}</Typography>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.dateTimeStyle} activeOpacity={0.9} onPress={showTimePicker}>
                                        <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: 8 }]}>
                                            <Typography variant="semiBold">Time</Typography>
                                            <Typography color={colors.textLight} variant="semiBold">{time ? time : 'HH/MM'}</Typography>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ marginHorizontal: responsiveWidth(2) }} >
                                    <Typography variant="bold" lineHeight={40}>Book Ride</Typography>
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
                                <ScrollView contentContainerStyle={styles.seatingOrderContainerView} style={styles.seatingOrderView}>
                                    {
                                        seatingOrder.map((item, index) => {
                                            const selected = selectedSeats.some(_selected => _selected === index);
                                            return (
                                                <TouchableOpacity
                                                    key={`seatingOrder${index}`}
                                                    activeOpacity={1}
                                                    disabled={item === 'driver'}
                                                    style={[
                                                        styles.item,
                                                        selected && { backgroundColor: colors.secondaryGreen },
                                                    ]}
                                                    onPress={setSeatingOrder.bind(this, index)}
                                                >
                                                    <Image source={images.carSeat}
                                                        style={{
                                                            width: 50, height: 80,
                                                            tintColor:
                                                                selected ? colors.white :
                                                                    item === 'driver' ? colors.warning :
                                                                        item === 'passenger' ? colors.secondaryGreen :
                                                                            colors.black,
                                                        }}
                                                        resizeMode="contain" />
                                                    <Typography variant="semiBold" size={12}
                                                        color={selected ? colors.white : colors.textPrimary} >
                                                        {getValue(item)}
                                                    </Typography>
                                                </TouchableOpacity>
                                            );
                                        })
                                    }
                                </ScrollView>


                                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                    <Button onPress={setVisible.bind(this, false)} style={{ flex: 1, margin: 2, backgroundColor: colors.warning }} title="Cancel" />
                                    <Button disabled={(bookingType === 'custom-seats' && !selectedSeats.length) || bookingType === null || !date || !time}
                                        onPress={bookRideHandler} style={{ flex: 1, margin: 2, backgroundColor: colors.primary }} title="Book" />
                                </View>
                            </>
                    }
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
    dateTimeStyle: {
        padding: 2,
        backgroundColor: colors.white,
        borderRadius: 4,
        borderColor: colors.primaryGrey,
        borderWidth: 0.5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '48%',
        paddingVertical: responsiveHeight(1),
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
        marginTop: responsiveHeight(5),
        height: responsiveHeight(30),
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
});

export default BookTransportModal;
