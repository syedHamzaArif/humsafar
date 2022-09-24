import React, { Fragment, useState } from 'react';
import { Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { CodeField, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { random6digitnum } from '#util/index';
import { colors } from '#res/colors';
import Typography from '#components/common/Typography';
import images from '#assets/index';
import { Service } from '#config/service';
import styles from './styles/mobileNumber.styles';
import globalStyles from '#res/global.styles';

const MobileNumber = ({ navigation }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [value, setValue] = useState();

    const ref = useBlurOnFulfill({ value, cellCount: 11 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const submitHandler = async () => {
        if (value?.length !== 11) return setError('Enter valid mobile number');
        setLoading(true);
        try {
            const { data } = await Service.cellExist(value);
            if (data === true) {
                navigation.navigate('Login', { phoneNumber: value });
            }
            else {
                const updatedCode = random6digitnum();
                const result = await Service.getOTP(value, updatedCode);
                if (result === 'OK') {
                    navigation.navigate('OTP', { phoneNumber: value, OTPCode: updatedCode });
                    return result;
                }
            }
        } catch (_err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
            setValue(null);
        }
        setLoading(false);
    };

    const _onChangeText = (_code) => {
        setValue(_code);
        setError('');
    };

    const _renderCell = ({ index, symbol, isFocused }) => (
        <Text
            key={`value-${index}`}
            style={styles.cell}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol}
        </Text>
    );


    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <Image resizeMode="stretch"
                    source={images.header_bg}
                    style={globalStyles.image} />
            </View>
            <View style={styles.main} >
                {
                    loading ? <ActivityIndicator color={colors.newSecondary} size="large" /> :
                        <>
                            <Typography new style={styles.heading}>Enter Your Mobile Number</Typography>
                            <View style={styles.inputView} >
                                <CodeField
                                    ref={ref}
                                    {...props}
                                    value={value}
                                    dataDetectorTypes="phoneNumber"
                                    onChangeText={_onChangeText}
                                    cellCount={11}
                                    keyboardType="phone-pad"
                                    textContentType="oneTimeCode"
                                    onBlur={submitHandler}
                                    renderCell={_renderCell}
                                />
                            </View>
                        </>
                }
                {
                    error ? <Typography new variant="semiBold" style={styles.error}>{error}</Typography> : null
                }
            </View>
            <View style={styles.footer} >
                <TouchableOpacity onPress={submitHandler} activeOpacity={1} style={styles.footerButton} >
                    <Image source={images.footer_btn_alt} style={globalStyles.image} resizeMode="cover" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MobileNumber;
