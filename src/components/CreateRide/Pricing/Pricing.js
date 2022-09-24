import React from 'react';
import { View, TouchableOpacity, Image, Switch, TextInput } from 'react-native';
import Typography from '#components/common/Typography';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { colors } from '#res/colors';
import Config from 'react-native-config';
import { Icon } from 'react-native-elements';
import styles from './pricing.styles';
import globalStyles from '#res/global.styles';
import VehicleAdditionalInfo from '#components/VehicleAdditionalInfo';

const Pricing = ({ state, title, stateChange, seatingCapacity, passengerPreferences }) => {

    const {
        isAc, isLuggage, isSmoking, isMusic,
        passengerPreference, male, female, child,
        seatsAvailable, specialNote, perSeat, fullCar,
        isEnabled,
    } = state[title];

    const toggleSwitch = () => stateChange('isEnabled', !isEnabled);

    const choosePreferenceFilterHandler = (_filter) => {
        // setPreferenceFilter(_filter);
        stateChange('passengerPreference', _filter);
    };

    const seatingCapacityValidator = (updatedState) => {
        var count = 0;
        for (const key in updatedState) {
            const value = updatedState[key];
            count = +count + +value;
        }
        if (count > seatingCapacity) return false;
        return true;
    };

    const seatingCapacityHandler = (name, value) => {
        const updatedState = { male, female, child, seatsAvailable };
        updatedState[name] = value;
        const isValid = seatingCapacityValidator(updatedState);
        if (isValid) stateChange(name, value);
    };

    return (
        <View style={styles.root}>
            <Typography new size={12} variant="semiBold">Additional Details / Pricing</Typography>
            <VehicleAdditionalInfo
                stateChange={stateChange}
                isAc={isAc}
                isLuggage={isLuggage}
                isSmoking={isSmoking}
                isMusic={isMusic}
            />
            <Typography new size={12} variant="semiBold">Passenger Preference</Typography>
            <View style={[styles.details, styles.passengerPreference]}>
                {
                    passengerPreferences.map((item, index) => {
                        const selected = passengerPreference === item.passenger_preference_id;
                        return (
                            <TouchableOpacity key={`passenger_preference${index}`}
                                style={styles.passengerStyling} activeOpacity={0.6}
                                onPress={choosePreferenceFilterHandler.bind(this, item.passenger_preference_id)}
                            >
                                <View style={styles.insideImage}>
                                    <Image resizeMode="contain"
                                        source={{ uri: Config.SERVER + item.preference_image }}
                                        style={{
                                            width: '50%', height: 40,
                                            tintColor: selected ? colors.newAccent : colors.newPrimary,
                                        }} />
                                </View>
                                <Typography new color={selected ? colors.newAccent : colors.newPrimary}
                                    align="center" style={{ marginTop: responsiveHeight(1) }}
                                    size={9} variant="semiBold">{item.passenger_preference}</Typography>
                            </TouchableOpacity>
                        );
                    })
                }
            </View>
            <Typography new >
                <Typography new variant="bold" size={14} color={colors.warning} >
                    {'Note: '}
                </Typography>
                <Typography new size={12} color={colors.warning} variant="semiBold">
                    {`Seating capacity of your car is ${seatingCapacity}. Please make sure to allot the seats accordingly.`}
                </Typography>
            </Typography>

            <View style={[styles.row, styles.passengerWithYou]}>
                <Typography new size={12} variant="semiBold">Passenger with you</Typography>
                <Switch
                    trackColor={{ false: '#767577', true: colors.secondary }}
                    thumbColor={isEnabled ? colors.primary : '#f4f3f4'}
                    ios_backgroundColor={isEnabled ? colors.newAccent : colors.newSecondary}
                    style={styles.toggle}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>
            {
                isEnabled ? <>
                    <View style={[styles.row, { justifyContent: 'space-between', marginVertical: responsiveHeight(1) }]}>
                        <View style={styles.row}>
                            <Typography new size={12} variant="semiBold">Male</Typography>
                            <TextInput
                                keyboardType="decimal-pad"
                                style={styles.input}
                                value={male}
                                onChangeText={seatingCapacityHandler.bind(this, 'male')}
                            />
                        </View>
                        <View style={styles.row}>
                            <Typography new size={12} variant="semiBold">Female</Typography>
                            <TextInput
                                keyboardType="decimal-pad"
                                style={styles.input}
                                value={female}
                                onChangeText={seatingCapacityHandler.bind(this, 'female')}
                            />
                        </View>
                        <View style={styles.row}>
                            <Typography new size={12} variant="semiBold">Child</Typography>
                            <TextInput
                                keyboardType="decimal-pad"
                                style={styles.input}
                                value={child}
                                onChangeText={seatingCapacityHandler.bind(this, 'child')}
                            />
                        </View>
                    </View>
                </> : null
            }
            <View style={[styles.row, { justifyContent: 'space-between', marginVertical: responsiveHeight(1) }]}>
                <Typography new size={12} variant="semiBold">Seats Available</Typography>
                <TextInput
                    keyboardType="decimal-pad"
                    style={[styles.bottomInput, { width: responsiveWidth(15) }]}
                    value={seatsAvailable}
                    onChangeText={seatingCapacityHandler.bind(this, 'seatsAvailable')}
                />
            </View>
            <View style={[globalStyles.row, styles.specialNotesView]} >
                <Typography new style={styles.specialNoteHeading} size={12} variant="semiBold">Special Note</Typography>
                <TextInput
                    textAlignVertical="top"
                    placeholder="Special notes you want to add for your trip"
                    multiline={true}
                    style={styles.inputSpecial}
                    value={specialNote}
                    onChangeText={(text) => stateChange('specialNote', text)}
                />
            </View>
            <View style={[styles.row, { justifyContent: 'space-around', marginVertical: responsiveHeight(2) }]}>
                <View>
                    <Typography new size={12} variant="semiBold">Per Seat</Typography>
                    <TextInput
                        keyboardType="decimal-pad"
                        style={[styles.bottomInput, styles.carTypeInput, styles.perSeat]}
                        value={perSeat}
                        onChangeText={(text) => stateChange('perSeat', text)}
                    />
                    <Typography new>
                        <Typography new size={10} variant="small">Estimate</Typography>
                        <Typography new size={13} variant="semiBold"> 1500</Typography>
                    </Typography>
                </View>
                <View>
                    <Typography new size={12} color={colors.secondary} variant="semiBold">Full Car</Typography>
                    <TextInput
                        keyboardType="decimal-pad"
                        style={[styles.bottomInput, styles.carTypeInput, styles.fullCar]}
                        value={fullCar}
                        onChangeText={(text) => stateChange('fullCar', text)}
                    />
                    <Typography new>
                        <Typography new size={10} variant="small">Estimate</Typography>
                        <Typography new size={13} variant="semiBold"> 5000</Typography>
                    </Typography>
                </View>
            </View>
        </View>
    );
};

export default Pricing;
