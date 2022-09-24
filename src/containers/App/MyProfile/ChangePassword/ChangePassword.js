import Button from '#components/common/Button';
import Typography from '#components/common/Typography';
import { Service } from '#config/service';
import { colors } from '#res/colors';
import { width } from '#util/';
import { showPopUpMessage } from '#util/';
import { getValue } from '#util/';
import { responsiveSize } from '#util/';
import React, { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ChangePassword = ({ navigation }) => {

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isKeyboardUp, setIsKeyboardUp] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showError, setShowError] = useState(false);

    const [states, setStates] = useState({
        previousPassword: {
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
        for (let inputIdentifer in updated) {
            updatedFormIsValid = updated[inputIdentifer].valid && updatedFormIsValid;
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
        if (states.previousPassword.value === '') {
            setError('Required All fields');
            return;
        }
        else if (states.newPassword.value !== states.confirmPassword.value) {
            setError('Password do not match');
            return;
        }
        else if (states.newPassword.value === states.previousPassword.value) {
            setError('New password & old password cannot be same');
            return;
        }
        else {
            setLoading(true);
            try {
                const updatedData = {
                    previousPassword: states.previousPassword.value,
                    newPassword: states.newPassword.value,
                };
                const { status } = await Service.changePassword(updatedData);
                if (status) {
                    showPopUpMessage('Success', 'Successfully changed password', 'success');
                    navigation.goBack();
                } else {
                    showPopUpMessage('Failed', 'Something went wrong', 'danger');
                }
            } catch (err) {
                showPopUpMessage('Failed', 'Something went wrong', 'danger');
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
                ...styles.root, justifyContent: isKeyboardUp ? 'flex-start' : 'space-evenly', marginTop: useSafeAreaInsets().top
            }}>
            <Typography variant="bold" size={24}>Change your password</Typography>
            <View>
                {
                    Object.entries(states).map(([key, value]) => (
                        <Input
                            key={key}
                            placeholder={getValue(key)}
                            inputContainerStyle={{
                                width: '100%',
                                borderBottomWidth: 0,
                            }}
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
                                        iconStyle={{ marginRight: 10 }}
                                        hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
                                        onPress={showHandler.bind(this, key, !value.show)}
                                    />
                                    : null
                            }

                        />
                    ))
                }
            </View>
            {
                error ? <Typography style={styles.error}>{error}</Typography> : null
            }
            <Button style={{ width: '90%' }} title="Done" loading={loading} onPress={submitHandler} />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        // justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: responsiveSize(3),
        backgroundColor: colors.background,
    },
    input: {
        paddingHorizontal: 12,
        borderWidth: 1,
        backgroundColor: colors.white,
        borderRadius: 12,
        marginVertical: 8,
        borderColor: '#eee',
        padding: 3,
        width: width * 0.9,
    },
    inputStyle: {
        fontSize: 14,
        textAlign: 'center',
    },
    error: {
        fontSize: 12,
        textAlign: 'center',
        color: colors.warning,
    },
});


export default ChangePassword;
