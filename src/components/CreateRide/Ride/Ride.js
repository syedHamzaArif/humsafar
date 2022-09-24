import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Typography from '#components/common/Typography';
import RNGooglePlaces from 'react-native-google-places';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { colors } from '#res/colors';
import ModalDatePicker from 'react-native-modal-datetime-picker';
import { getAddressCustomer, getTime } from '#util/index';
import moment from 'moment';
import images from '#assets/';
import styles from './ride.styles';
import globalStyles from '#res/global.styles';
import { Icon } from 'react-native-elements';
import PickAndDrop from '#components/PickAndDrop';


const Ride = ({ state, stateChange, title }) => {

    const { date, time,
        startRegion: {
            backEndValue: start_address,
            cityLocation: pickupCityLocation },
        destinationRegion: {
            backEndValue: end_address,
            cityLocation: dropOffCityLocation,
        },
    } = state[title];

    const [show, setShow] = useState(false);
    const [showTime, setShowTime] = useState(false);

    const placesHandler = (type) => {
        RNGooglePlaces.openAutocompleteModal({
            country: 'PK',
        })
            .then(async (place) => {
                const currentLocation = {
                    latitude: place.location.latitude,
                    longitude: place.location.longitude,
                    latitudeDelta: 0.0030,
                    longitudeDelta: 0.0030,
                };
                const { city } = await getAddressCustomer(place.location.latitude, place.location.longitude);
                stateChange(type,
                    currentLocation, place.addressComponents[0].shortName, city, true);
            })
            .catch(_error => console.trace(_error.message));
    };

    //Date
    const onChange = (selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        // setDate(currentDate);
        stateChange('date', moment(currentDate).format('MM-DD-YYYY'));
        // stateChange('date', currentDate);
    };
    const showMode = () => {
        setShow(true);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    //Time
    const onChangeTime = (selectedDate) => {
        const currentDate = selectedDate || date;
        setShowTime(false);
        // setTime(currentDate);
        stateChange('time', getTime(currentDate));

    };
    const showModeTime = () => {
        setShowTime(true);
    };

    const showTimePicker = () => {
        showModeTime('time');
    };

    return (
        <View style={styles.body}>
            <View style={StyleSheet.absoluteFill}>
                <Image resizeMode="contain" source={images.footer_bg}
                    style={[globalStyles.image, { marginTop: responsiveHeight(20) }]} />
            </View>
            <PickAndDrop
                pickupCityLocation={pickupCityLocation}
                dropOffCityLocation={dropOffCityLocation}
                start_address={start_address}
                end_address={end_address}
                pressHandler={placesHandler}
            />
            <View style={[styles.row, styles.dateTimeView]}>
                <TouchableOpacity style={styles.dateTimeStyle} activeOpacity={0.9} onPress={showDatepicker}>
                    <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: 8 }]}>
                        <Icon name="calendar" type="feather" size={responsiveFontSize(2.4)} color={colors.newPrimary} />
                        <Typography color={colors.textLight} style={{ flex: 1 }} align="center"
                            variant="semiBold">
                            {date ? date : 'MM/DD/YYYY'}
                        </Typography>
                    </View>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.dateTimeStyle} activeOpacity={0.9} onPress={showTimePicker}>
                    <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: 8 }]}>
                        <Icon name="clock" type="feather" size={responsiveFontSize(2.4)} color={colors.newPrimary} />
                        <Typography color={colors.textLight} style={{ flex: 1 }} align="center"
                            variant="semiBold">
                            {time ? time : 'HH/MM'}
                        </Typography>
                    </View>
                </TouchableOpacity>
            </View>
            <ModalDatePicker
                isVisible={show}
                value={date}
                mode="date"
                is24Hour={true}
                minimumDate={new Date()}
                display="spinner"
                onConfirm={onChange}
                onCancel={setShow.bind(this, false)}
            />
            <ModalDatePicker
                isVisible={showTime}
                value={time}
                mode="time"
                is24Hour={true}
                // minimumDate={new Date()}
                display="spinner"
                onConfirm={onChangeTime}
                onCancel={setShowTime.bind(this, false)}
            />
        </View>
    );
};

export default Ride;
