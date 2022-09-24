import images from '#assets/';
import Button from '#components/common/Button';
import Typography from '#components/common/Typography';
import { Service } from '#config/service';
import { colors } from '#res/colors';
import globalStyles from '#res/global.styles';
import { getValue } from '#util/';
import { hitSlop, showPopUpMessage } from '#util/index';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, TouchableOpacity } from 'react-native';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles/resetPassword.styles';

const ResetPassword = ({ navigation, route }) => {

    const { phoneNumber } = route.params;

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isKeyboardUp, setIsKeyboardUp] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showError, setShowError] = useState(false);

    const [states, setStates] = useState({
        newPassword: {
            show: false,
            value: '',
            visible: true,
            validation: {
                required: true,
                minLength: 6,
            },
            valid: false,
            showError: true,
            errorMessage: 'Password must contain at least 6 letters',
        },
        confirmPassword: {
            show: false,
            value: '',
            visible: true,
            validation: {
                required: true,
                minLength: 6,
            },
            valid: false,
            showError: true,
            errorMessage: 'Password must contain at least 6 letters',
        },
    });

    useEffect(() => {
        const _keyboardUp = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardUp(true));
        const keyboardDown = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardUp(false));

        return () => {
            _keyboardUp.remove();
            keyboardDown.remove();
        };
    }, []);

    const checkValidity = (value, validation) => {
        let isValid = true;
        // if (typeof value !== '')
        if (validation.required) {
            isValid = value?.trim() !== '' && isValid;
        }
        if (validation.minLength) {
            isValid = value.length >= validation.minLength;
        }
        return isValid;
    };

    const changeHandler = (key, value) => {
        const updated = { ...states };
        const updatedItem = { ...updated[key] };
        updatedItem.value = value;
        updatedItem.valid = checkValidity(value, updatedItem.validation);
        updated[key] = updatedItem;
        let updatedFormIsValid = true;
        for (let inputIdentifier in updated) {
            updatedFormIsValid = updated[inputIdentifier].valid && updatedFormIsValid;
        }
        setStates(updated);
        setIsFormValid(updatedFormIsValid);
        error ? setError('') : null;
    };

    const showHandler = (key, value) => {
        const updated = { ...states, [key]: { ...states[key], show: value } };
        setStates(updated);
    };

    const submitHandler = async () => {
        if (!isFormValid) return setShowError(true);
        if (states.newPassword.value !== states.confirmPassword.value) {
            setError('Password does not match');
            return;
        }
        else {
            setLoading(true);
            try {
                const updatedData = {
                    newPassword: states.newPassword.value,
                    cell_no: phoneNumber,
                };
                const { status } = await Service.resetPassword(updatedData);
                if (status) {
                    showPopUpMessage('Success', 'Successfully changed password', 'success');
                    navigation.popToTop();
                } else {
                    showPopUpMessage('Failed', 'Something went wrong');
                }
            } catch (err) {
                setError(err);
                console.trace('Inside Catch => ', err);
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
                ...styles.root, justifyContent: isKeyboardUp ? 'flex-start' : 'space-evenly', marginTop: useSafeAreaInsets().top,
            }}>
            <Typography new variant="bold" color={colors.white} size={24}>Enter new password</Typography>
            <View style={styles.main}>
                {
                    Object.entries(states).map(([key, value]) => {
                        return (
                            <Input
                                key={key}
                                placeholder={getValue(key)}
                                inputContainerStyle={styles.inputContainerStyle}
                                style={styles.inputStyle}
                                containerStyle={styles.input}
                                autoCapitalize="none"
                                onChangeText={changeHandler.bind(this, key)}
                                value={value.value}
                                textContentType="password"
                                secureTextEntry={!value.show}
                                errorMessage={showError && !value.valid ? value.errorMessage : ''}
                                renderErrorMessage={showError && !value.valid}
                                rightIcon={
                                    key !== 'confirmPassword' ?
                                        <Icon
                                            underlayColor="transparent"
                                            name={!value.show ? 'lock' : 'unlock-alt'}
                                            type="font-awesome"
                                            iconStyle={styles.iconStyle}
                                            hitSlop={hitSlop}
                                            onPress={showHandler.bind(this, key, !value.show)}
                                        />
                                        : null
                                }

                            />
                        );
                    })
                }
            </View>
            {
                error ? <Typography new variant="semiBold" style={styles.error}>{error}</Typography> : null
            }
            <View style={styles.footer} >
                <TouchableOpacity onPress={submitHandler}
                    disabled={loading}
                    activeOpacity={1} style={styles.footerButton} >
                    {loading && <ActivityIndicator style={styles.loader} color={colors.newPrimary} size={24} />}
                    <Image source={images.footer_btn_alt} style={globalStyles.image} resizeMode="cover" />
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
    );
};



export default ResetPassword;
