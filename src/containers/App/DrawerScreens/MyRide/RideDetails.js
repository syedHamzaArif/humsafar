import React, { useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import Typography from '#components/common/Typography';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { colors } from '#res/colors';
import MapView from 'react-native-maps';
import images from '#assets/';
import { getFonts } from '#util/';
import { Checkbox } from 'react-native-paper';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getAge } from '#util/';

const allLocationData = {
    latitude: 24.8805035, longitude: 67.0852124, latitudeDelta: 0.030, longitudeDelta: 0.030,
};

const RideDetails = ({ navigation: { goBack }, route: { params: { item, itemPressHandler, from } } }) => {

    const { userData: { id } } = useSelector(state => state.userReducer);

    const {
        ride_id, is_ac, luggage, is_smoking, is_music, with_driver_male, with_driver_female, with_driver_child, seating_capacity,
        special_notes, price_per_seat, price_full_vehicle, start_address, end_address,
        ride_date, ride_time, model, vehicle_type, year, manufacturer, name, dateOfBirth,
        profession, gender, from_city, to_city, user_id, transporter_id, model_seating_capacity,
    } = item;

    const mapRef = useRef(null);

    var updatedSeatOrder = [];
    if (item.seat_orders) {
        updatedSeatOrder = [...item.seat_orders];
        updatedSeatOrder.splice(1, 0, { type_id: 3 });
    }

    const pressHandler = () => {
        goBack();
        itemPressHandler();
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.root}>
            {
                +id === +user_id ? null :
                    <>
                        <Typography size={12} color={colors.secondary} variant="semiBold">Review Details</Typography>
                        <View style={styles.personalDetailStyle}>
                            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                                <Typography size={12} variant="semiBold">Name: </Typography>
                                <Typography size={12} variant="semiBold">{name}</Typography>
                            </View>
                            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                                <Typography size={12} variant="semiBold">Gender:</Typography>
                                <Typography size={12} variant="semiBold">{gender}</Typography>
                            </View>
                            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                                <Typography size={12} variant="semiBold">Age:</Typography>
                                <Typography size={12} variant="semiBold">{getAge(dateOfBirth)}</Typography>
                            </View>
                            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                                <Typography size={12} variant="semiBold">Profession:</Typography>
                                <Typography size={12} variant="semiBold">{profession}</Typography>
                            </View>
                        </View>
                    </>
            }
            {
                !ride_id ? null :
                    <>

                        <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                            <Typography size={12} variant="semiBold">Departure: </Typography>
                        </View>
                        <View style={[styles.row, { marginTop: responsiveHeight(0.5), borderBottomWidth: 0.4, paddingBottom: 4, marginBottom: 4, borderColor: colors.textPrimary }]}>
                            <Typography size={14} color={colors.warning} variant="semiBold">Date: {moment(ride_date).format('DD-MM-YYYY')}</Typography>
                            <Typography size={14} color={colors.warning} variant="semiBold">Time: {ride_time}</Typography>
                        </View>
                    </>
            }


            {/* <View style={styles.personalDetailStyle}> */}
            <Typography size={12} color={colors.secondary} variant="semiBold">Vehicle Details</Typography>
            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                <Typography size={12} variant="semiBold">Car Type</Typography>
                <Typography size={12} variant="semiBold">{vehicle_type}</Typography>
            </View>
            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                <Typography size={12} variant="semiBold">Maker </Typography>
                <Typography size={12} variant="semiBold">{manufacturer}</Typography>
            </View>
            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                <Typography size={12} variant="semiBold">Model </Typography>
                <Typography size={12} variant="semiBold">{model}</Typography>
            </View>
            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                <Typography size={12} variant="semiBold">Year of make </Typography>
                <Typography size={12} variant="semiBold">{year}</Typography>
            </View>

            <View style={styles.personalDetailStyle}>
                <Typography size={12} color={colors.secondary} variant="semiBold">Pickup Location</Typography>
                <View style={styles.pickUpLocation}>
                    <MapView
                        provider="google"
                        ref={mapRef}
                        style={styles.mapStyle}
                        initialRegion={allLocationData}
                        mapType="standard"
                        flat={true}
                        pitchEnabled={false}
                        rotateEnabled={false}
                        zoomEnabled={false}
                        scrollEnabled={false}
                    />
                    <View style={styles.fromToStyling}>
                        <Image resizeMode="contain" source={images.FromToIcon} style={{ width: 18, height: 80 }} />
                        <View style={{ width: '42%', overflow: 'hidden' }}>
                            <View style={{ height: responsiveHeight(5) }}>
                                <Typography variant="semiBold" color={colors.primary}>From</Typography>
                                <Typography variant="small" color={colors.textPrimary}>{from_city}</Typography>
                            </View>
                            <Image resizeMode="contain" source={images.verticalLine} style={{ width: responsiveWidth(35), height: 10 }} />
                            <View style={{ height: responsiveHeight(5) }}>
                                <Typography variant="semiBold" color={colors.primary}>To</Typography>
                                <Typography variant="small" color={colors.textPrimary}>{to_city}</Typography>
                            </View>
                        </View>

                        <View style={{ width: '45%', overflow: 'hidden' }}>
                            <TouchableOpacity activeOpacity={0.7}
                                style={[styles.row, { height: responsiveHeight(5), alignItems: 'flex-end', paddingBottom: responsiveHeight(0.5) }]}>
                                <Typography variant="small" color={colors.textPrimary}>{start_address ? start_address : 'Pickup Location'}</Typography>
                                <Image resizeMode="contain" source={images.rideIcon} style={{ width: 15, height: 15 }} />
                            </TouchableOpacity>
                            <Image resizeMode="contain" source={images.verticalLine} style={{ width: responsiveWidth(35), height: 10 }} />
                            <TouchableOpacity activeOpacity={0.7}
                                style={[styles.row, { height: responsiveHeight(5), alignItems: 'flex-end', paddingBottom: responsiveHeight(0.5) }]}>
                                <Typography variant="small" color={colors.textPrimary}>{end_address ? end_address : 'Drop off Location'}</Typography>
                                <Image resizeMode="contain" source={images.rideIcon} style={{ width: 15, height: 15 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {
                with_driver_male || with_driver_female || with_driver_child ?
                    <>
                        <Typography size={12} color={colors.secondary} variant="semiBold">With driver</Typography>
                        <View style={[styles.row, { justifyContent: 'space-between', marginVertical: responsiveHeight(1), marginHorizontal: responsiveWidth(1) }]}>
                            <View style={styles.row}>
                                <Typography size={12} variant="semiBold">Male</Typography>
                                <TextInput editable={false} keyboardType="decimal-pad" style={[styles.input, { width: responsiveWidth(10) }]} value={with_driver_male?.toString()} />
                            </View>
                            <View style={styles.row}>
                                <Typography size={12} variant="semiBold">Female</Typography>
                                <TextInput editable={false} keyboardType="decimal-pad" style={[styles.input, { width: responsiveWidth(10) }]} value={with_driver_female?.toString()} />
                            </View>
                            <View style={styles.row}>
                                <Typography size={12} variant="semiBold">Child</Typography>
                                <TextInput editable={false} keyboardType="decimal-pad" style={[styles.input, { width: responsiveWidth(10) }]} value={with_driver_child?.toString()} />
                            </View>
                        </View>
                    </> : null
            }
            {
                !ride_id && !transporter_id ? null :
                    <>
                        <Typography size={12} color={colors.secondary} variant="semiBold">Seats Availability</Typography>

                        <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: responsiveWidth(1), marginVertical: responsiveHeight(1) }]}>
                            <Typography size={12} variant="semiBold">Total Seats</Typography>
                            <Typography variant="semiBold" align="center" >{transporter_id ? model_seating_capacity.toString() : seating_capacity?.toString()}</Typography>
                        </View>
                        <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: responsiveWidth(1), marginVertical: responsiveHeight(1) }]}>
                            <Typography size={12} variant="semiBold">Per Seat Price</Typography>
                            <Typography variant="semiBold" align="center" >{price_per_seat?.toString()}</Typography>
                        </View>
                        <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: responsiveWidth(1), marginVertical: responsiveHeight(1) }]}>
                            <Typography size={12} variant="semiBold">Full Car Price</Typography>
                            <Typography variant="semiBold" align="center" >{price_full_vehicle?.toString()}</Typography>
                        </View>
                    </>
            }

            <View style={styles.personalDetailStyle}>

                <Typography size={12} color={colors.secondary} variant="semiBold">Additional Details</Typography>
                <View style={styles.row}>
                    <Typography size={12} variant="semiBold">AC</Typography>
                    <Checkbox.Android status={is_ac ? 'checked' : 'unchecked'}
                        // onPress={() => { setCheckedAC(!checkedAC); }}
                        color={colors.secondaryGreen}
                    />
                </View>
                <View style={styles.row}>
                    <Typography size={12} variant="semiBold">Luggage</Typography>
                    <Checkbox.Android status={luggage ? 'checked' : 'unchecked'}
                        // onPress={() => { setCheckedLuggage(!checkedLuggage); }}
                        color={colors.secondaryGreen}
                    />
                </View>
                <View style={styles.row}>
                    <Typography size={12} variant="semiBold">Smoking</Typography>
                    <Checkbox.Android status={is_smoking ? 'checked' : 'unchecked'}
                        // onPress={() => { setCheckedSmoking(!checkedSmoking); }}
                        color={colors.secondaryGreen}
                    />
                </View>
                <View style={styles.row}>
                    <Typography size={12} variant="semiBold">Music</Typography>
                    <Checkbox.Android status={is_music ? 'checked' : 'unchecked'}
                        // onPress={() => { setCheckedSmoking(!checkedSmoking); }}
                        color={colors.secondaryGreen}
                    />
                </View>
            </View>

            {
                !special_notes ? null :
                    <View style={[styles.personalDetailStyle, { borderBottomWidth: 0.4 }]}>
                        <Typography size={12} color={colors.secondary} variant="semiBold">Special Notes</Typography>
                        <Typography size={12} lineHeight={24} variant="regular">{special_notes}</Typography>
                    </View>
            }


            <View style={styles.seatingOrderView}>
                {
                    updatedSeatOrder?.map?.((_item, index) => {
                        const selected = _item.user_id === id;
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
                                                _item.type_id === 1 && !_item.user_id ? colors.secondaryGreen :
                                                    _item.type_id === 2 ? colors.primaryOrange :
                                                        _item.type_id === 3 || _item.user_id ? colors.warning :
                                                            colors.black,
                                    }}
                                    resizeMode="contain" />
                                <Typography variant="semiBold" size={12}
                                    color={selected ? colors.white : colors.textPrimary} >
                                    {
                                        +_item.type_id === 2 ? 'With Driver' :
                                            +_item.type_id === 3 ? 'Driver' :
                                                +_item.type_id === 4 ? 'Not Available' :
                                                    selected ? 'Requested' :
                                                        _item.user_id ? 'Booked' : 'Available'
                                    }
                                </Typography>
                            </View>
                        );
                    })
                }
            </View>
            <View style={[styles.row, { justifyContent: 'space-around', marginTop: responsiveHeight(2) }]}>

                {
                    +id === +user_id || from === 'my-booking' || item.requested || item.status !== 'Active' ? null :
                        <TouchableOpacity
                            onPress={pressHandler}
                            disabled={item.requested}
                            style={
                                [
                                    styles.button,
                                    { backgroundColor: item.requested ? colors.white : colors.secondary },
                                    item.requested ? { borderWidth: 1, borderColor: colors.secondary } : {},
                                ]
                            }
                        >
                            <Typography variant="semiBold" color={item.requested ? colors.secondary : colors.white}>
                                {item.requested ? 'Requested' : 'Book Ride'}
                            </Typography>
                        </TouchableOpacity>
                }
                <TouchableOpacity style={[styles.button]} onPress={goBack}>
                    <Typography variant="semiBold" color={colors.white}>Back</Typography>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(5),
        backgroundColor: colors.backgroundWhite,
    },
    personalDetailStyle: {
        borderTopWidth: 0.4,
        borderColor: colors.textPrimary,
        marginVertical: responsiveHeight(1),
        paddingTop: responsiveHeight(1),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: responsiveWidth(1),
    },
    pickUpLocation: {
        height: responsiveHeight(20),
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: responsiveHeight(1),
    },
    mapStyle: {
        ...StyleSheet.absoluteFill,
        width: '100%',
    },
    fromToStyling: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: colors.white,
        borderRadius: 14,
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(2),
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
    },
    input: {
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
        // backgroundColor: colors.white,
        padding: 0,
        marginLeft: 10,
        borderRadius: 6,
        paddingHorizontal: 5,
        color: colors.textPrimary,
        fontFamily: getFonts().semiBold,
        width: responsiveWidth(20),
        textAlign: 'center',
    },
    // button: {
    //     borderRadius: 12,
    //     alignItems: 'center',
    //     width: '40%',
    //     paddingVertical: responsiveHeight(1.5),
    //     marginTop: responsiveHeight(3),
    // },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(1),
        marginHorizontal: responsiveWidth(0.5),
        width: responsiveWidth(30),
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 10,
        paddingVertical: 10,
    },
    modalStyle: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingTop: responsiveHeight(3),
        alignItems: 'center',
    },
    modalButton: {
        width: '50%',
        // borderWidth: 0.25,
        borderColor: colors.textBody,
        paddingVertical: responsiveHeight(2),
        marginTop: responsiveHeight(2),
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

export default RideDetails;
