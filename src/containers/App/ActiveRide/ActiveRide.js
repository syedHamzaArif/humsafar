import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Typography from '#components/common/Typography';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { colors } from '#res/colors';
import MapView from 'react-native-maps';
import images from '#assets/';
import { getFonts } from '#util/';
import { Checkbox } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Service } from '#config/service';
import { getTimeDifference, showPopUpMessage, updateReducer } from '#util/index';
import LoaderView from '#components/common/LoaderView';
import Button from '#components/common/Button';
import Loader from '#components/common/Loader';
import { updateridedata } from '#redux/actions/actionCreators';
import Modal from '#components/common/Modal';
import { Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import CancelModal from './CancelModal';

const allLocationData = {
    latitude: 24.8805035, longitude: 67.0852124, latitudeDelta: 0.030, longitudeDelta: 0.030,
};

var timer;

const ActiveRide = ({ navigation, route: { params: { userType, rideId } } }) => {

    const mapRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [highlightLoading, setHighlightLoading] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(null);
    const [rideData, setRideData] = useState({});

    const [reviewParams, setReviewParams] = useState([]);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);

    const dispatch = useDispatch();
    const updateRideData = (data) => dispatch(updateridedata(data));
    const { rideReducer: { status: rideStatus }, userReducer: { userData: { id: userId } } } = useSelector(state => state);

    const giveReviewPressHandler = async () => {
        setLoading(true);
        try {
            const { data } = await Service.getReviewParams({ type: userType === 'driver' ? 'passenger' : 'driver' });
            setReviewParams(data);
            navigation.navigate('Review', { reviewParams: data, reviewId: null, submitHandler: submitReviewHandler });
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            setLoading(false);
        }
    };

    const submitReviewHandler = async ({ reviewText = '', reviewParams: updatedReviewParams = {} }) => {
        try {
            setLoading(true);
            const reviewObj = {
                review: reviewText,
                receiver_id: rideData.user_id,
                ride_id: rideData.ride_id,
                ratings: JSON.stringify(updatedReviewParams),
            };
            const { status, message } = await Service.postReview(reviewObj);
            if (status) {
                showPopUpMessage('Success', message, 'success');
                navigation.goBack();
            } else {
                showPopUpMessage('Failed', 'Something went wrong', 'danger');
            }
        } catch (error) {
            console.trace('Inside Catch => ', error);
            showPopUpMessage('Failed', typeof error === 'string' ? error : 'Something went wrong', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const cancelRideHandler = async () => {
        try {
            setHighlightLoading(true);
            setCancelModalVisible(false);
            const { status, message } = await Service.cancelRide({ ride_id: rideData.ride_id });
            if (status) {
                showPopUpMessage('Success', message, 'success');
            } else {
                showPopUpMessage('Failed', 'Something went wrong', 'danger');
            }
        } catch (err) {
            console.trace('Inside Catch => ', err);
            showPopUpMessage('Failed', typeof err === 'string' ? err : 'Something went wrong', 'danger');
        } finally {
            setHighlightLoading(false);
        }
    };

    const rideActionHandler = async () => {
        try {
            setHighlightLoading(true);
            const body = { ride_id: rideData.ride_id };
            if (rideData.status === 'Active' && userType === 'driver') {
                const { status, message } = await Service.startRide(body);
                if (status) {
                    const updatedRideData = { ...rideData };
                    updatedRideData.status = 'Progress';
                    setRideData(updatedRideData);
                    updateReducer('status', 'Progress', updateRideData);
                    showPopUpMessage('Success', message, 'success');
                }
            } else if (rideData.status === 'Progress' && userType === 'driver') {
                const { status, message } = await Service.endRide(body);
                if (status) {
                    const updatedRideData = { ...rideData };
                    updatedRideData.status = 'Completed';
                    updateReducer('status', 'Completed', updateRideData);
                    setRideData(updatedRideData);
                    showPopUpMessage('Success', message, 'success');
                }
            } else if (rideData.status === 'Completed' || userType === 'passenger') {
                giveReviewPressHandler();
            }
        } catch (error) {
            console.trace('Inside Catch => ', error);
            showPopUpMessage('Failed', typeof error === 'string' ? error : 'Something went wrong!', 'danger');
        } finally {
            setHighlightLoading(false);
        }
    };


    const cellNoPressHandler = () => {
        // if (Platform.OS === 'android') sendPhoneCall('15.', true);
        Linking.openURL(`tel:${rideData.cell_no}`);
    };

    const init = async () => {
        try {
            setLoading(true);
            var updatedData = {};
            if (rideStatus === 'Completed') { return clearTimeout(timer); }
            if (userType === 'driver') {
                const { data } = await Service.getActiveRide();
                updatedData = data;
            } else if (userType === 'passenger') {
                const { data } = await Service.getRide(rideId);
                updatedData = data;
            }
            updatedData.seat_orders.splice(1, 0, { type_id: 3 });
            setRideData(updatedData);
            if (updatedData.status === 'Progress') {
                getTimeDifferenceHandler(updatedData.updated_at);
            }
        } catch (error) {
            console.trace('Inside Catch => ', error);
            showPopUpMessage('Failed', 'Something went wrong', 'danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rideStatus]);

    const getTimeDifferenceHandler = _updated_at => {
        async function difference(delay, __updated_at) {
            const timeDiff = getTimeDifference(__updated_at ? __updated_at : rideData.updated_at);
            setTimeElapsed(timeDiff);
            timer = setTimeout(() => difference(delay, __updated_at), delay);
        }
        difference(1000, _updated_at);
    };

    return (
        loading ? <LoaderView /> :
            <>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.root}>
                    {highlightLoading && <Loader />}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: rideStatus !== 'Progress' ? 'center' : 'space-between' }}>
                        {
                            rideStatus === 'Progress' ?
                                <View>
                                    <Typography variant="bold" >Ride is in Progress</Typography>
                                    <Typography size={18} variant="semiBold" color={colors.warning} >{timeElapsed ?? ''}</Typography>
                                    {
                                        timeElapsed ?
                                            <Typography size={12}>Ride Time</Typography>
                                            : null
                                    }
                                </View>
                                : null
                        }
                        {
                            rideStatus === 'Completed' ?
                                <View style={{ marginVertical: responsiveHeight(3) }}>
                                    <Typography variant="bold" >Ride Completed</Typography>
                                    <Typography size={18} variant="semiBold" color={colors.warning} >{timeElapsed ?? ''}</Typography>
                                    {
                                        timeElapsed ?
                                            <Typography size={12}>Ride Time</Typography>
                                            : null
                                    }
                                </View>
                                : null
                        }
                        {
                            (userType === 'passenger' && rideStatus !== 'Completed') || (userType === 'driver' && rideStatus === 'Completed') ? null :
                                <>
                                    <Button onPress={rideActionHandler}
                                        title={
                                            rideStatus === 'Active' && userType === 'driver' ? 'Start' :
                                                rideStatus === 'Progress' ? 'End' : 'Review'
                                        }
                                        style={{
                                            ...styles.startButton,
                                            height: responsiveHeight(6),
                                            marginHorizontal: responsiveWidth(6),
                                            backgroundColor: colors.secondaryGreen,
                                        }}
                                    />
                                    {
                                        rideStatus === 'Active' ?
                                            <Button onPress={setCancelModalVisible.bind(this, true)}
                                                title="Cancel Ride"
                                                style={{
                                                    paddingHorizontal: responsiveWidth(2),
                                                    height: responsiveHeight(6),
                                                    marginHorizontal: responsiveWidth(6),
                                                    backgroundColor: colors.warning,
                                                }}
                                            /> : null
                                    }
                                </>
                        }
                    </View>
                    <View style={{ marginVertical: responsiveHeight(1) }}>
                        <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                            <Typography size={12} variant="semiBold">Departure: </Typography>
                        </View>
                        <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                            <Typography size={16} color={colors.warning} variant="semiBold">Date:</Typography>
                            <Typography size={16} color={colors.warning} variant="semiBold">{moment(rideData.ride_date).format('DD-MM-YYYY')}</Typography>
                        </View>
                        <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                            <Typography size={16} color={colors.warning} variant="semiBold">Time:</Typography>
                            <Typography size={16} color={colors.warning} variant="semiBold">{rideData.ride_time}</Typography>
                        </View>
                    </View>
                    {
                        userType === 'driver' ? null :
                            <View style={styles.personalDetailStyle}>
                                <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                                    <Typography size={12} variant="semiBold">Name: </Typography>
                                    <Typography size={12} variant="semiBold">{rideData.name}</Typography>
                                </View>
                                <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                                    <Typography size={12} variant="semiBold">Phone Number:</Typography>
                                    <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={cellNoPressHandler} >
                                        <Icon name="call" type="material" size={14} color={colors.warning} />
                                        <Typography
                                            style={{ marginLeft: 6 }}
                                            color={colors.warning}
                                            size={12} variant="semiBold">
                                            {rideData.cell_no}
                                        </Typography>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    }
                    <Typography size={12} color={colors.secondary} variant="semiBold">Vehicle Details</Typography>
                    <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                        <Typography size={12} variant="semiBold">Model </Typography>
                        <Typography size={12} variant="semiBold">{rideData.model}</Typography>
                    </View>
                    <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                        <Typography size={12} variant="semiBold">Car Type: </Typography>
                        <Typography size={12} variant="semiBold">{rideData.vehicle_type}</Typography>
                    </View>
                    <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                        <Typography size={12} variant="semiBold">Maker </Typography>
                        <Typography size={12} variant="semiBold">{rideData.manufacturer}</Typography>
                    </View>
                    <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                        <Typography size={12} variant="semiBold">Year </Typography>
                        <Typography size={12} variant="semiBold">{rideData.year}</Typography>
                    </View>
                    <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                        <Typography size={12} variant="semiBold">Reg-Number </Typography>
                        <Typography size={12} variant="semiBold">{rideData.reg_num}</Typography>
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
                                        <Typography variant="small" color={colors.textPrimary}>City</Typography>
                                    </View>
                                    <Image resizeMode="contain" source={images.verticalLine} style={{ width: responsiveWidth(35), height: 10 }} />
                                    <View style={{ height: responsiveHeight(5) }}>
                                        <Typography variant="semiBold" color={colors.primary}>To</Typography>
                                        <Typography variant="small" color={colors.textPrimary}>City</Typography>
                                    </View>
                                </View>

                                <View style={{ width: '45%', overflow: 'hidden' }}>
                                    <TouchableOpacity activeOpacity={0.7}
                                        style={[styles.row, { height: responsiveHeight(5), alignItems: 'flex-end', paddingBottom: responsiveHeight(0.5) }]}>
                                        <Typography variant="small" color={colors.textPrimary}>{rideData.start_address ? rideData.start_address : 'Pickup Location'}</Typography>
                                        <Image resizeMode="contain" source={images.rideIcon} style={{ width: 15, height: 15 }} />
                                    </TouchableOpacity>
                                    <Image resizeMode="contain" source={images.verticalLine} style={{ width: responsiveWidth(35), height: 10 }} />
                                    <TouchableOpacity activeOpacity={0.7}
                                        style={[styles.row, { height: responsiveHeight(5), alignItems: 'flex-end', paddingBottom: responsiveHeight(0.5) }]}>
                                        <Typography variant="small" color={colors.textPrimary}>{rideData.end_address ? rideData.end_address : 'Drop Off Location'}</Typography>
                                        <Image resizeMode="contain" source={images.rideIcon} style={{ width: 15, height: 15 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    <Typography size={12} color={colors.secondary} variant="semiBold">Seats Availability</Typography>
                    <View style={{ marginVertical: responsiveHeight(1), marginHorizontal: responsiveWidth(1) }}>
                        <Typography size={12} variant="semiBold">With Driver</Typography>
                        <View style={[styles.row, { justifyContent: 'space-between' }]}>
                            <View style={styles.row}>
                                <Typography size={12} variant="semiBold">Male</Typography>
                                <Typography size={12} style={{ marginHorizontal: responsiveWidth(2) }} >{rideData.with_driver_male?.toString?.()}</Typography>
                            </View>
                            <View style={styles.row}>
                                <Typography size={12} variant="semiBold">Female</Typography>
                                <Typography size={12} style={{ marginHorizontal: responsiveWidth(2) }} >{rideData.with_driver_female?.toString?.()}</Typography>
                            </View>
                            <View style={styles.row}>
                                <Typography size={12} variant="semiBold">Child</Typography>
                                <Typography size={12} style={{ marginHorizontal: responsiveWidth(2) }} >{rideData.with_driver_child?.toString?.()}</Typography>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: responsiveWidth(1), marginVertical: responsiveHeight(1) }]}>
                        <Typography size={12} variant="semiBold">Total Seats</Typography>
                        {/* <TextInput editable={false} keyboardType="decimal-pad" style={styles.input} value={rideData.seating_capacity?.toString?.()} /> */}
                        <Typography size={12} style={{ marginRight: 10 }} >{rideData.seating_capacity?.toString?.()}</Typography>
                    </View>
                    <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: responsiveWidth(1), marginVertical: responsiveHeight(1) }]}>
                        <Typography size={12} variant="semiBold">Price Per Seat</Typography>
                        {/* <TextInput editable={false} keyboardType="decimal-pad" style={styles.input} value={rideData.price_per_seat?.toString?.()} /> */}
                        <Typography size={12} style={{ marginRight: 10 }} >{rideData.price_per_seat?.toString?.()}</Typography>
                    </View>
                    <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: responsiveWidth(1), marginVertical: responsiveHeight(1) }]}>
                        <Typography size={12} variant="semiBold">Price Full Car</Typography>
                        {/* <TextInput editable={false} keyboardType="decimal-pad" style={styles.input} value={rideData.price_full_vehicle?.toString?.()} /> */}
                        <Typography size={12} style={{ marginRight: 10 }} >{rideData.price_full_vehicle?.toString?.()}</Typography>
                    </View>

                    <View style={styles.personalDetailStyle}>

                        <Typography size={12} color={colors.secondary} variant="semiBold">Additional Details</Typography>
                        <View style={styles.row}>
                            <Typography size={12} variant="semiBold">AC</Typography>
                            <Checkbox.Android status={rideData.is_ac ? 'checked' : 'unchecked'}
                                // onPress={() => { setCheckedAC(!checkedAC); }}
                                color={colors.secondaryGreen}
                            />
                        </View>
                        <View style={styles.row}>
                            <Typography size={12} variant="semiBold">Luggage</Typography>
                            <Checkbox.Android status={rideData.luggage ? 'checked' : 'unchecked'}
                                // onPress={() => { setCheckedLuggage(!checkedLuggage); }}
                                color={colors.secondaryGreen}
                            />
                        </View>
                        <View style={styles.row}>
                            <Typography size={12} variant="semiBold">Smoking</Typography>
                            <Checkbox.Android status={rideData.is_smoking ? 'checked' : 'unchecked'}
                                // onPress={() => { setCheckedSmoking(!checkedSmoking); }}
                                color={colors.secondaryGreen}
                            />
                        </View>
                        <View style={styles.row}>
                            <Typography size={12} variant="semiBold">Music</Typography>
                            <Checkbox.Android status={rideData.is_music ? 'checked' : 'unchecked'}
                                // onPress={() => { setCheckedSmoking(!checkedSmoking); }}
                                color={colors.secondaryGreen}
                            />
                        </View>
                        <View style={styles.row}>
                            <Typography size={12} style={{ flex: 1 }} variant="semiBold" >Special Notes</Typography>
                            <Typography size={12} style={{ flex: 2 }} align="right" variant="regular" >{rideData.special_notes}</Typography>
                        </View>
                    </View>

                    <View style={styles.seatingOrderView}>
                        {
                            rideData?.seat_orders?.map?.((item, index) => {
                                const selected = +item.user_id === +userId;
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
                                                        item.type_id === 2 ? colors.primaryOrange :
                                                            item.type_id === 3 ? colors.warning :
                                                                item.type_id === 1 ? colors.secondaryGreen :
                                                                    colors.black,
                                            }}
                                            resizeMode="contain" />
                                        {
                                            userType === 'passenger' &&
                                            <Typography variant="semiBold" size={12}
                                                color={selected ? colors.white : colors.textPrimary} >
                                                {
                                                    +item.type_id === 2 ? 'With Driver' :
                                                        +item.type_id === 3 ? 'Driver' :
                                                            +item.type_id === 4 ? 'Not Available' :
                                                                selected ? 'Booked' : 'Passenger'}
                                            </Typography>
                                        }
                                        {
                                            userType === 'driver' &&
                                            <Typography variant="semiBold" size={12}
                                                color={selected ? colors.white : colors.textPrimary} >
                                                {
                                                    +item.type_id === 2 ? 'With Driver' :
                                                        +item.type_id === 3 ? 'Driver' :
                                                            +item.type_id === 4 ? 'Empty' :
                                                                item.user?.name ?? 'Available'
                                                }
                                            </Typography>
                                        }
                                    </View>
                                );
                            })
                        }
                    </View>

                    <View style={[styles.row, { justifyContent: 'space-around' }]}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondary }]} onPress={navigation.goBack}>
                            <Typography variant="smallBold" color={colors.white}>Back</Typography>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <Modal visible={cancelModalVisible} setVisible={setCancelModalVisible}>
                    <CancelModal
                        setVisible={setCancelModalVisible}
                        pressHandler={cancelRideHandler}
                    />
                </Modal>
            </>
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
        borderBottomWidth: 0.4,
        borderTopWidth: 0.4,
        borderColor: colors.textPrimary,
        marginVertical: responsiveHeight(1),
        paddingVertical: responsiveHeight(0.5),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    button: {
        borderRadius: 12,
        alignItems: 'center',
        width: '60%',
        paddingVertical: responsiveHeight(1.5),
        marginTop: responsiveHeight(3),
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
    startButton: {
        width: responsiveWidth(50),
        alignSelf: 'center',
        marginVertical: responsiveHeight(2),
        backgroundColor: colors.warning,
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

export default ActiveRide;
