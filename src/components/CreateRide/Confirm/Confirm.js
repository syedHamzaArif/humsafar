import React, { Fragment, useState } from 'react';
import { View, Image, TouchableOpacity, TextInput } from 'react-native';
import Typography from '#components/common/Typography';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { colors } from '#res/colors';
import images from '#assets/';
import Modal from '#components/common/Modal';
import { useDispatch } from 'react-redux';
import { Service } from '#config/service';
import { getValue, showPopUpMessage, updateReducer } from '#util/index';
import Loader from '#components/common/Loader';
import { updateridedata } from '#redux/actions/actionCreators';
import styles from './confirm.styles';
import { Icon } from 'react-native-elements';
import globalStyles from '#res/global.styles';

const Confirm = ({
    step, rideDetail = {}, pricingDetail = {},
    vehicleDetail = {}, goBack, user_vehicle_id,
    seatingOrder: seating_order, transportDetail,
    submitHandler,
}) => {

    const [loading, setLoading] = useState(false);

    const {
        isAc: is_ac,
        isLuggage: luggage,
        isSmoking: is_smoking,
        isMusic: is_music,
        passengerPreference: passenger_preference,
        male: with_driver_male,
        female: with_driver_female,
        child: with_driver_child,
        seatsAvailable: seating_capacity,
        specialNote: special_notes,
        perSeat: price_per_seat,
        fullCar: price_full_vehicle,
    } = pricingDetail;

    const {
        carType: { frontEndValue: carType } = {},
        maker: { frontEndValue: maker } = {},
        model: { frontEndValue: model, backEndValue: modelBackEndValue } = {},
        year: { frontEndValue: year, backEndValue: yearBackEndValue } = {},
        reg_Number,
        nic_front,
        nic_back,
        car_papers,
        driver_license,
    } = vehicleDetail;

    const {
        date: ride_date,
        time: ride_time,
        startRegion: { backEndValue: start_address, cityLocation: from_city } = {},
        destinationRegion: { backEndValue: end_address, cityLocation: to_city } = {},
    } = rideDetail;

    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const dispatch = useDispatch();
    const updateRideData = (data) => dispatch(updateridedata(data));

    const onPressHandler = async () => {
        submitHandler?.();
        try {
            setLoading(true);
            let createUserVehicleObj = {
                vehicle_model_id: modelBackEndValue,
                vehicle_year_id: yearBackEndValue,
                reg_num: reg_Number,
                color: 'red',
                nic_front, nic_back, papers: car_papers, license: driver_license,
            };
            const formData = new FormData();
            for (const key in createUserVehicleObj) {
                const value = createUserVehicleObj[key];
                if (value && typeof value === 'object') {
                    if (!value[0].path.includes('http'))
                        formData.append(key, {
                            uri: value[0].path,
                            name: value[0].fileName,
                            type: value[0].type,
                        });
                } else {
                    formData.append(key, value);
                }
            }

            let result;
            let vehicle_id;
            if (user_vehicle_id) {
                result = await Service.updateUserVehicle(formData);
                vehicle_id = user_vehicle_id;
            }
            else {
                result = await Service.userVehicle(formData);
                vehicle_id = result.data.user_vehicle_id;
            }
            if (vehicle_id) {
                const updatedSeatingOrder = seating_order.filter(item => item !== 'driver');

                let createRideObj = {
                    vehicle_id, seating_capacity, luggage, is_smoking, is_ac,
                    is_music, start_address, end_address,
                    passenger_preference, price_per_seat, price_full_vehicle,
                    with_driver_child: with_driver_child ? with_driver_child : 0,
                    with_driver_female: with_driver_female ? with_driver_female : 0,
                    with_driver_male: with_driver_male ? with_driver_male : 0,
                    ride_date, ride_time, special_notes, from_city, to_city,
                    seating_order: JSON.stringify(updatedSeatingOrder),
                };
                const { status, message } = await Service.createRide(createRideObj);
                if (status) {
                    showPopUpMessage('Success', message, 'success');
                    updateReducer('status', 'Active', updateRideData);
                    goBack();
                } else {
                    throw 'Error while creating ride';
                }
            } else {
                throw 'Error while creating user vehicle';
            }
        } catch (error) {
            showPopUpMessage('Failed', typeof error === 'string' ? error : 'Something went wrong', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const rides = Array.isArray(transportDetail) ? transportDetail : [rideDetail];
    console.log('file: confirm.js => line 133 => rides', rides);

    return (
        <View style={styles.root}>
            {
                !loading ? null : <Loader />
            }
            <Typography new size={14} variant="semiBold">Ride Details</Typography>
            {
                rides.map((ride, index) => (
                    <Fragment key={`rideItem${index}`}>
                        <View style={styles.personalDetailStyle}>
                            <View style={styles.fromToStyling}>
                                <Image resizeMode="contain" source={images.FromToIcon} style={{ width: 18, height: 80 }} />
                                <View style={{ width: '42%', overflow: 'hidden' }}>
                                    <View style={{ height: responsiveHeight(5) }}>
                                        <Typography new variant="semiBold" >From</Typography>
                                        <Typography new variant="small" >{ride.startRegion.cityLocation}</Typography>
                                    </View>
                                    <Image resizeMode="contain" source={images.verticalLine} style={{ width: responsiveWidth(35), height: 10 }} />
                                    <View style={{ height: responsiveHeight(5) }}>
                                        <Typography new variant="semiBold">To</Typography>
                                        <Typography new variant="small">{ride.destinationRegion.cityLocation}</Typography>
                                    </View>
                                </View>

                                <View style={{ width: '45%', overflow: 'hidden' }}>
                                    <TouchableOpacity activeOpacity={0.7}
                                        style={[styles.row, { height: responsiveHeight(5), alignItems: 'flex-end', paddingBottom: responsiveHeight(0.5) }]}>
                                        <Typography variant="small" color={colors.textPrimary}>{ride.startRegion.backendValue || ride.startRegion.backEndValue || 'Pickup Location'}</Typography>
                                        <Image resizeMode="contain" source={images.rideIcon} style={{ width: 15, height: 15 }} />
                                    </TouchableOpacity>
                                    <Image resizeMode="contain" source={images.verticalLine} style={{ width: responsiveWidth(35), height: 10 }} />
                                    <TouchableOpacity activeOpacity={0.7}
                                        style={[styles.row, { height: responsiveHeight(5), alignItems: 'flex-end', paddingBottom: responsiveHeight(0.5) }]}>
                                        <Typography variant="small" color={colors.textPrimary}>{ride.destinationRegion.backendValue || ride.destinationRegion.backEndValue || 'Dropoff Location'}</Typography>
                                        <Image resizeMode="contain" source={images.rideIcon} style={{ width: 15, height: 15 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {
                            ride.price_per_seat &&
                            <View style={[styles.row, { justifyContent: 'space-around' }]}>
                                <View>
                                    <Typography new size={12} variant="semiBold">Per Seat</Typography>
                                    <TextInput
                                        keyboardType="decimal-pad"
                                        style={[styles.bottomInput, styles.carTypeInput, styles.perSeat]}
                                        value={ride.price_per_seat || price_per_seat}
                                        editable={false}
                                    />
                                </View>
                                <View>
                                    <Typography new size={12} color={colors.secondary} variant="semiBold">Full Car</Typography>
                                    <TextInput
                                        keyboardType="decimal-pad"
                                        style={[styles.bottomInput, styles.carTypeInput, styles.fullCar]}
                                        value={ride.price_full_vehicle || price_full_vehicle}
                                        editable={false}
                                    />
                                </View>
                            </View>
                        }
                    </Fragment>
                ))
            }

            {
                (ride_date || ride_time) &&
                <View style={[styles.itemContainer, globalStyles.row]} >
                    <View style={[globalStyles.row, styles.rowItem]} >
                        <Icon name="departure-board" type="material" size={responsiveFontSize(2.4)} color={colors.newPrimary} />
                        <Typography color={colors.newPrimary} new size={12} variant="semiBold">Departure</Typography>
                    </View>
                    <View style={[globalStyles.row, styles.rowItem]} >
                        <Icon name="calendar" type="feather" size={responsiveFontSize(2.4)} color={colors.newPrimary} />
                        <Typography color={colors.newPrimary} new size={12} variant="semiBold">{ride_date}</Typography>
                    </View>
                    <View style={[globalStyles.row, styles.rowItem]} >
                        <Icon name="clock" type="feather" size={responsiveFontSize(2.4)} color={colors.newPrimary} />
                        <Typography color={colors.newPrimary} new size={12} variant="semiBold">{ride_time}</Typography>
                    </View>
                </View>
            }
            <View>
                <Typography style={styles.vehicleDetailHeading} new size={12} variant="semiBold">Vehicle Details</Typography>
                <View style={[styles.itemContainer, globalStyles.row, styles.vehicleDetailContainer]} >
                    <View style={[globalStyles.row, styles.vehicleDetailItem]}>
                        <Icon containerStyle={styles.vehicleDetailIcon} name="car" type="font-awesome"
                            color={colors.newPrimary} size={responsiveFontSize(2.4)} />
                        <Typography color={colors.newPrimary} new size={12} flex variant="semiBold">{carType}</Typography>
                    </View>
                    <View style={[globalStyles.row, styles.vehicleDetailItem]}>
                        <Icon containerStyle={styles.vehicleDetailIcon} name="tools" type="font-awesome-5"
                            color={colors.newPrimary} size={responsiveFontSize(2.4)} />
                        <Typography color={colors.newPrimary} new size={12} flex variant="semiBold">{maker}</Typography>
                    </View>
                    <View style={[globalStyles.row, styles.vehicleDetailItem]}>
                        <Icon containerStyle={styles.vehicleDetailIcon} name="car-side" type="font-awesome-5"
                            color={colors.newPrimary} size={responsiveFontSize(2.4)} />
                        <Typography color={colors.newPrimary} new size={12} flex variant="semiBold">{model}</Typography>
                    </View>
                    <View style={[globalStyles.row, styles.vehicleDetailItem]}>
                        <Icon containerStyle={styles.vehicleDetailIcon} name="date-range" type="material"
                            color={colors.newPrimary} size={responsiveFontSize(2.4)} />
                        <Typography color={colors.newPrimary} new size={12} flex variant="semiBold">{year}</Typography>
                    </View>
                </View>
            </View>

            {
                with_driver_male || with_driver_female || with_driver_child ?
                    <View>
                        <Typography style={styles.vehicleDetailHeading} new size={12} variant="semiBold">Passenger with you</Typography>
                        <View style={styles.itemContainer}>
                            <View View style={[styles.row, { justifyContent: 'space-between', marginVertical: responsiveHeight(1), marginHorizontal: responsiveWidth(1) }]}>
                                <View style={styles.row}>
                                    <Typography color={colors.newPrimary} new size={12} variant="semiBold">Male</Typography>
                                    <TextInput editable={false} keyboardType="decimal-pad" style={[styles.input, { width: responsiveWidth(10) }]} value={with_driver_male ? with_driver_male : '0'} />
                                </View>
                                <View style={styles.row}>
                                    <Typography color={colors.newPrimary} new size={12} variant="semiBold">Female</Typography>
                                    <TextInput editable={false} keyboardType="decimal-pad" style={[styles.input, { width: responsiveWidth(10) }]} value={with_driver_female ? with_driver_female : '0'} />
                                </View>
                                <View style={styles.row}>
                                    <Typography color={colors.newPrimary} new size={12} variant="semiBold">Child</Typography>
                                    <TextInput editable={false} keyboardType="decimal-pad" style={[styles.input, { width: responsiveWidth(10) }]} value={with_driver_child ? with_driver_child : '0'} />
                                </View>
                            </View>
                        </View>
                    </View>
                    : null
            }

            <Typography style={styles.vehicleDetailHeading} new size={12} variant="semiBold">Additional Details / Pricing</Typography>
            <View style={[globalStyles.row, styles.itemContainer]}>
                <View style={styles.detail} >
                    <Icon name="snowflake-o" type="font-awesome" size={responsiveFontSize(2)}
                        color={is_ac ? colors.newAccent : colors.newPrimary} />
                    <Typography new size={12} style={styles.detailTitle}
                        color={is_ac ? colors.newAccent : colors.newPrimary} >AC</Typography>
                </View>
                <View style={styles.detail} >
                    <Icon name="luggage" type="material" size={responsiveFontSize(2)}
                        color={luggage ? colors.newAccent : colors.newPrimary} />
                    <Typography new size={12} style={styles.detailTitle}
                        color={luggage ? colors.newAccent : colors.newPrimary} >Luggage</Typography>
                </View>
                <View style={styles.detail} >
                    <Icon name="smoking-rooms" type="material" size={responsiveFontSize(2)}
                        color={is_smoking ? colors.newAccent : colors.newPrimary} />
                    <Typography new size={12} style={styles.detailTitle}
                        color={is_smoking ? colors.newAccent : colors.newPrimary} >Smoking</Typography>
                </View>
                <View style={styles.detail} >
                    <Icon name="music" type="font-awesome" size={responsiveFontSize(2)}
                        color={is_music ? colors.newAccent : colors.newPrimary} />
                    <Typography new size={12} style={styles.detailTitle}
                        color={is_music ? colors.newAccent : colors.newPrimary} >Music</Typography>
                </View>
            </View>

            {
                !special_notes ? null :
                    <View style={[globalStyles.row, styles.specialNotesView]} >
                        <Typography new flex align="center" size={12} variant="semiBold">Special Note</Typography>
                        <Typography new flex >{special_notes}</Typography>
                    </View>
            }
            {
                !price_per_seat ? null :
                    <View style={[styles.row, { justifyContent: 'space-around', marginVertical: responsiveHeight(2) }]}>
                        <View>
                            <Typography new size={12} variant="semiBold">Per Seat</Typography>
                            <TextInput
                                keyboardType="decimal-pad"
                                style={[styles.bottomInput, styles.carTypeInput, styles.perSeat]}
                                value={price_per_seat}
                                editable={false}
                            />
                        </View>
                        <View>
                            <Typography new size={12} color={colors.secondary} variant="semiBold">Full Car</Typography>
                            <TextInput
                                keyboardType="decimal-pad"
                                style={[styles.bottomInput, styles.carTypeInput, styles.fullCar]}
                                value={price_full_vehicle}
                                editable={false}
                            />
                        </View>
                    </View>
            }

            {
                !seating_order ? null :
                    <View style={[styles.itemContainer, styles.seatingOrderContainer]} >
                        <Typography new size={12} style={styles.vehicleDetailHeading} variant="semiBold">Seating Order</Typography>
                        <View style={styles.seatingOrderView}>
                            {
                                seating_order.map((item, index) => (
                                    <View
                                        key={`seatingOrder${index}`}
                                        activeOpacity={1}
                                        style={styles.item}
                                    >
                                        <Image source={images.carSeat}
                                            style={{
                                                width: 40, height: 40,
                                                tintColor:
                                                    item === 'with-driver' ? colors.primaryOrange :
                                                        item === 'driver' ? colors.warning :
                                                            item === 'passenger' ? colors.primaryGreen :
                                                                colors.black,
                                            }}
                                            resizeMode="contain" />
                                        <Typography new variant="semiBold" size={12} >
                                            {getValue(item)}
                                        </Typography>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
            }

            <View style={[styles.row, { justifyContent: 'space-around' }]}>
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.newSecondary }]} onPress={onPressHandler}>
                    <Typography variant="smallBold" color={colors.white}>Confirm Ride</Typography>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.warning }]} onPress={setConfirmModalVisible.bind(this, true)}>
                    <Typography variant="smallBold" color={colors.white}>Cancel Ride</Typography>
                </TouchableOpacity>
            </View>
            <Modal
                setVisible={setConfirmModalVisible}
                visible={confirmModalVisible}
            >
                <View style={styles.modalStyle}>
                    <Typography size={16}
                        align="center"
                        style={{ marginVertical: 15, paddingHorizontal: 50 }}
                        variant="semiBold">Are you sure you want to remove all details?</Typography>
                    <View style={styles.row}>
                        <TouchableOpacity style={[styles.modalButton]} onPress={() => setConfirmModalVisible(false)}>
                            <Typography color={colors.secondary} size={16} align="center">No</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton]} onPress={step}>
                            <Typography size={16} align="center" style={{ color: colors.primary }} >Yes</Typography>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default Confirm;
