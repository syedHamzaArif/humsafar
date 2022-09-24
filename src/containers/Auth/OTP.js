import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CodeField, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { hitSlop, isIOS, random6digitnum, showPopUpMessage } from '#util/index';
import { colors } from '#res/colors';
import Typography from '#components/common/Typography';
import images from '#assets/index';
import { responsiveHeight } from '#util/responsiveSizes';
import { Service } from '#config/service';
import { BackHandler } from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import { Keyboard } from 'react-native';
import globalStyles from '#res/global.styles';
import styles from './styles/otp.styles';

const OTPScreen = ({ navigation, route: { params } }) => {
    // var { phoneNumber, OTPCode, from } = params;
    const phoneNumber = params?.phoneNumber ?? '';
    const OTPCode = params?.OTPCode ?? '';
    const from = params?.from ?? '';

    const [error, setError] = useState(true);
    const [timer, setTimer] = useState(30);
    const [value, setValue] = useState();
    const [OTP, setOTP] = useState(OTPCode);

    const ref = useBlurOnFulfill({ value, cellCount: 6 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const confirmCode = async (_code) => {
        let updatedCode = _code;
        if (!updatedCode || typeof updatedCode === 'object') { updatedCode = value; }

        if (updatedCode?.length !== 6) return setError('Invalid code');

        // eslint-disable-next-line eqeqeq
        if (OTP == updatedCode) {
            if (from && from === 'forget-password') {
                setTimeout(() => { navigation.navigate('Reset Password', { phoneNumber }); }, 1200);
            } else {
                setTimeout(() => { navigation.navigate('SignUp', { phoneNumber }); }, 1200);
            }
        } else {
            showPopUpMessage('Failed', 'Wrong code entered', 'danger');
        }
    };

    let time;
    const startTimer = () => {
        if (timer !== 0) {
            time = setTimeout(() => {
                setTimer(_timer => _timer - 1);
            }, 1000);
        } else { clearTimeout(time); }
    };

    const startListeningForOtp = () => {
        if (isIOS()) return;
        RNOtpVerify.getOtp()
            .then(p => RNOtpVerify.addListener(otpHandler))
            .catch(p => console.trace(p));
    };

    const otpHandler = _message => {
        try {
            const otp = /(\d{6})/g.exec(_message)[1];
            setValue(otp);
            confirmCode(otp);
            RNOtpVerify.removeListener();
            Keyboard.dismiss();
        } catch (err) {
            console.trace('Inside Catch => ', err);
        }
    };


    useEffect(() => {
        startListeningForOtp();
        return RNOtpVerify.removeListener;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        const backhandler = BackHandler.addEventListener('hardwareBackPress', () => from === 'forget-password' ? true : false);
        return backhandler.remove;
    }, [from]);

    useEffect(() => {
        startTimer();
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer]);

    const resendHandler = async () => {
        setTimer(30);
        try {
            const updatedCode = random6digitnum();
            const result = await Service.getOTP(phoneNumber, updatedCode);
            if (result === 'OK') {
                setOTP(updatedCode);
                return result;
            } else {
                showPopUpMessage('Failed', 'Unable to send OTP right now, please try later');
            }

        } catch (_err) {
            console.trace('Inside Catch => ', _err);
        }
    };

    const _renderCell = ({ index, symbol, isFocused }) => (
        <Text
            key={index}
            style={[styles.cell, isFocused && { backgroundColor: colors.white }]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol}
        </Text>
    );

    return (
        <View style={styles.root}>
            <View style={StyleSheet.absoluteFill}>
                <Image resizeMode="contain" source={images.footer_bg}
                    style={[globalStyles.image, { marginTop: responsiveHeight(20) }]} />
            </View>
            <View style={styles.main} >
                <Typography new style={styles.heading} >Please enter the 6-digit code sent to you at {phoneNumber || '03092664248'}</Typography>
                <View style={[styles.inputView, !error && { marginBottom: responsiveHeight(1) }]} >
                    <CodeField
                        ref={ref}
                        {...props}
                        value={value}
                        onChangeText={(_code) => setValue(_code)}
                        cellCount={6}
                        keyboardType="phone-pad"
                        textContentType="oneTimeCode"
                        onBlur={confirmCode}
                        renderCell={_renderCell}
                    />
                </View>
                {
                    error ? <Typography new style={styles.error}>{error}</Typography> : null
                }
            </View>
            <View style={styles.footer}>
                <View style={styles.footerMain}>
                    {
                        timer !== 0 ?
                            <Typography new align="center" >{`Didn't get the code?\n\n You will be able to resend OTP in ${timer}`}</Typography>
                            :
                            <>
                                <Typography new align="center" >Didn't receive an OTP?</Typography>
                                <TouchableOpacity activeOpacity={1} onPress={resendHandler} hitSlop={hitSlop}>
                                    <Typography new align="center" variant="bold" style={styles.resendText}>Resend OTP</Typography>
                                </TouchableOpacity>
                            </>
                    }
                </View>
                <TouchableOpacity onPress={confirmCode} activeOpacity={1} style={styles.footerButton} >
                    <Image source={images.footer_btn_alt} style={globalStyles.image} resizeMode="cover" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OTPScreen;
