import Typography from '#components/common/Typography';
import VehicleAdditionalInfo from '#components/VehicleAdditionalInfo';
import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React from 'react';
import { TextInput } from 'react-native';
import { View, StyleSheet } from 'react-native';

const AdditionalDetails = ({ state: { additionalDetails }, setStateChange }) => {
    return (
        <View style={styles.root}>

            <View style={{ marginTop: responsiveHeight(2) }} >
                <Typography size={12} color={colors.secondary} variant="semiBold">Additional Details / Pricing</Typography>
                <VehicleAdditionalInfo
                    stateChange={setStateChange}
                    {...additionalDetails}
                />
            </View>

            <Typography
                style={{ marginVertical: responsiveHeight(1) }} size={12}
                variant="semiBold">
                Special Note
            </Typography>
            <TextInput
                textAlignVertical="top"
                multiline={true}
                style={styles.inputSpecial}
                value={additionalDetails.specialNote}
                onChangeText={text => setStateChange('specialNote', text)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveHeight(3),
    },
    details: {
        borderWidth: 0.3,
        borderColor: colors.buttonGray,
        borderRadius: 3,
        paddingHorizontal: responsiveWidth(2),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: responsiveHeight(2),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: colors.white,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputSpecial: {
        borderRadius: 6,
        borderWidth: 0.5,
        borderColor: colors.inactiveGray,
        height: responsiveHeight(20),
        paddingHorizontal: responsiveWidth(3),
        color: colors.textPrimary,
    },
});

export default AdditionalDetails;
