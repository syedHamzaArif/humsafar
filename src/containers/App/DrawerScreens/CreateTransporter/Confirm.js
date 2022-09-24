import React, { useRef, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Typography from '#components/common/Typography';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { colors } from '#res/colors';
import MapView from 'react-native-maps';
import images from '#assets/';
import { getFonts } from '#util/';
import { Checkbox } from 'react-native-paper';
import Modal from '#components/common/Modal';
import { useSelector } from 'react-redux';
import ImageModal from '#components/common/ImageModal';
import Button from '#components/common/Button';

const Confirm = ({
    state,
    additionalDetails,
    transports,
    backPressHandler,
    confirmPressHandler,
}) => {

    const { userData: { name, cell_no } } = useSelector(_state => _state.userReducer);
    const [imageCarouselModalVisible, setImageCarouselModalVisible] = useState(false);
    const [vehicleDocuments, setVehicleDocuments] = useState('');

    const {
        isAc: is_ac,
        isLuggage: luggage,
        isSmoking: is_smoking,
        isMusic: is_music,
        specialNote,
    } = additionalDetails;

    const {
        carType: { frontEndValue: carType },
        maker: { frontEndValue: maker },
        model: { frontEndValue: model },
        year: { frontEndValue: year },
        reg_Number,
        nic_front,
        nic_back,
        car_papers,
        driver_license,
    } = state;

    const mapRef = useRef(null);

    const vehicleDocumentsHandler = (_images) => {
        setVehicleDocuments(_images);
        setImageCarouselModalVisible(true);
    };

    return (
        <View style={styles.root}>
            <Typography size={12} color={colors.secondary} variant="semiBold">Review Your Details</Typography>
            <View style={styles.personalDetailStyle}>
                <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                    <Typography size={12} variant="semiBold">Name: </Typography>
                    <Typography size={12} variant="semiBold">{name}</Typography>
                </View>
                <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                    <Typography size={12} variant="semiBold">Phone Number:</Typography>
                    <Typography size={12} variant="semiBold">{cell_no}</Typography>
                </View>
            </View>

            <Typography size={12} color={colors.secondary} variant="semiBold">Vehicle Details</Typography>
            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                <Typography size={12} variant="semiBold">Car Type: </Typography>
                <Typography size={12} variant="semiBold">{carType}</Typography>
            </View>
            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                <Typography size={12} variant="semiBold">Maker </Typography>
                <Typography size={12} variant="semiBold">{maker}</Typography>
            </View>
            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                <Typography size={12} variant="semiBold">Model </Typography>
                <Typography size={12} variant="semiBold">{model}</Typography>
            </View>
            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                <Typography size={12} variant="semiBold">Year </Typography>
                <Typography size={12} variant="semiBold">{year}</Typography>
            </View>
            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                <Typography size={12} variant="semiBold">Reg-Number </Typography>
                <Typography size={12} variant="semiBold">{reg_Number}</Typography>
            </View>
            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                <Typography size={12} variant="semiBold">Car Papers </Typography>
                <TouchableOpacity activeOpacity={0.7} onPress={vehicleDocumentsHandler.bind(this, car_papers[0]?.path)}>
                    <Image resizeMode="contain" source={{ uri: car_papers[0]?.path }} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
            </View>
            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                <Typography size={12} variant="semiBold">NIC Front</Typography>
                <TouchableOpacity activeOpacity={0.7} onPress={vehicleDocumentsHandler.bind(this, nic_front[0]?.path)}>
                    <Image resizeMode="contain" source={{ uri: nic_front[0]?.path }} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
            </View>
            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                <Typography size={12} variant="semiBold">NIC Back</Typography>
                <TouchableOpacity activeOpacity={0.7} onPress={vehicleDocumentsHandler.bind(this, nic_back[0]?.path)}>
                    <Image resizeMode="contain" source={{ uri: nic_back[0]?.path }} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
            </View>
            <View style={[styles.row, { marginTop: responsiveHeight(0.5) }]}>
                <Typography size={12} variant="semiBold">Driver's License </Typography>
                <TouchableOpacity activeOpacity={0.7} onPress={vehicleDocumentsHandler.bind(this, driver_license[0]?.path)}>
                    <Image resizeMode="contain" source={{ uri: driver_license[0]?.path }} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.personalDetailStyle}>
                <Typography size={12} color={colors.secondary} variant="semiBold">Routes</Typography>
                {
                    transports.map((transport, index) => (
                        <View key={`transport${index}`} style={styles.pickUpLocation}>
                            <MapView
                                provider="google"
                                ref={mapRef}
                                style={styles.mapStyle}
                                initialRegion={transport.allLocationData[0]}
                                mapType="standard"
                                flat={true}
                                pitchEnabled={false}
                                rotateEnabled={false}
                                zoomEnabled={false}
                                scrollEnabled={false}
                            />
                            <View style={styles.fromToStyling}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignContent: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                    <Image resizeMode="contain" source={images.FromToIcon} style={{ width: 18, height: 80 }} />
                                    <View style={{ width: '42%', overflow: 'hidden' }}>
                                        <View style={{ height: responsiveHeight(5) }}>
                                            <Typography variant="semiBold" color={colors.primary}>From</Typography>
                                            <Typography variant="small" color={colors.textPrimary}>{transport.startRegion.cityLocation}</Typography>
                                        </View>
                                        <Image resizeMode="contain" source={images.verticalLine} style={{ width: responsiveWidth(35), height: 10 }} />
                                        <View style={{ height: responsiveHeight(5) }}>
                                            <Typography variant="semiBold" color={colors.primary}>To</Typography>
                                            <Typography variant="small" color={colors.textPrimary}>{transport.destinationRegion.cityLocation}</Typography>
                                        </View>
                                    </View>

                                    <View style={{ width: '45%', overflow: 'hidden' }}>
                                        <TouchableOpacity activeOpacity={0.7}
                                            style={[styles.row, { height: responsiveHeight(5), alignItems: 'flex-end', paddingBottom: responsiveHeight(0.5) }]}>
                                            <Typography variant="small" color={colors.textPrimary}>
                                                {transport.startRegion.backEndValue ? transport.startRegion.backEndValue : 'Pickup Location'}
                                            </Typography>
                                            <Image resizeMode="contain" source={images.rideIcon} style={{ width: 15, height: 15 }} />
                                        </TouchableOpacity>
                                        <Image resizeMode="contain" source={images.verticalLine} style={{ width: responsiveWidth(35), height: 10 }} />
                                        <TouchableOpacity activeOpacity={0.7}
                                            style={[styles.row, { height: responsiveHeight(5), alignItems: 'flex-end', paddingBottom: responsiveHeight(0.5) }]}>
                                            <Typography variant="small" color={colors.textPrimary}>
                                                {transport.destinationRegion.backEndValue ? transport.destinationRegion.backEndValue : 'Drop off Location'}
                                            </Typography>
                                            <Image resizeMode="contain" source={images.rideIcon} style={{ width: 15, height: 15 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ alignSelf: 'flex-start', marginRight: 4, marginTop: responsiveHeight(1) }}>
                                    <Typography>
                                        <Typography variant="semiBold" size={12} >{`Per seat: ${transport.price_per_seat ? transport.price_per_seat : 0} Rs \t\t\t`}</Typography>
                                        <Typography variant="semiBold" size={12} >{`Full vehicle: ${transport.price_full_vehicle ? transport.price_full_vehicle : 0} Rs`}</Typography>
                                    </Typography>
                                </View>
                            </View>
                        </View>
                    ))
                }
            </View>

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

                <View style={styles.row}>
                    <Typography size={12} style={{ flex: 1 }} variant="semiBold" >Special Notes</Typography>
                    <Typography size={12} style={{ flex: 2 }} align="right" variant="regular" >{specialNote}</Typography>
                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button onPress={backPressHandler} style={{ flex: 1, backgroundColor: colors.warning }} title="Back" />
                <Button onPress={confirmPressHandler} style={{ flex: 1 }} title="Confirm" />
            </View>

            <Modal
                animationIn="fadeIn"
                animationOut="fadeOut"
                backdropOpacity={0.9}
                setVisible={setImageCarouselModalVisible}
                style={{ padding: 0, margin: 0 }}
                visible={imageCarouselModalVisible} >
                <ImageModal
                    modalVisible={setImageCarouselModalVisible}
                    image={vehicleDocuments}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(5),
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
        backgroundColor: colors.white,
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
        width: '40%',
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
});

export default Confirm;
