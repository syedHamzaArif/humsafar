import images from '#assets/index';
import React, { useContext, useEffect, useState } from 'react';
import { Image, View, Keyboard, ActivityIndicator, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import InputComponent from '#components/common/Input';
import Typography from '#components/common/Typography';
import ModalList from '#components/common/ModalList';
import Modal from '#components/common/Modal';
import { colors } from '#res/colors';
import { AuthContext } from '#context/';
import { Service } from '#config/service';
import ModalDatePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { underAgeValidate } from '#util/';
import globalStyles from '#res/global.styles';
import styles from './styles/signUp.styles';

const SignUp = ({ navigation, route }) => {

    const number = route?.params?.phoneNumber;

    const { signup } = useContext(AuthContext);
    const [loginForm, updateLoginForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                name: 'name',
                placeholder: 'Name',
                autoCapitalize: 'words',
                blurOnSubmit: false,
            },
            value: '',
            visible: true,
            validation: {
                required: true,
            },
            errorMessage: 'Please enter a valid name',
            valid: false,
            headerMessage: 'Share Your Details',
        },
        gender: {
            elementType: 'dropdown',
            elementConfig: {
                name: 'gender',
                placeholder: 'Gender',
                autoCapitalize: 'none',
                blurOnSubmit: false,
            },
            value: '',
            visible: true,
            validation: {
                required: true,
            },
            errorMessage: 'Please select gender',
            valid: false,
            data: [
                { id: 0, type: 'Male' },
                { id: 0, type: 'Female' },
            ],
        },
        DOB: {
            elementType: 'dropdown',
            elementConfig: {
                name: 'DOB',
                placeholder: 'DOB',
                autoCapitalize: 'none',
                blurOnSubmit: false,
            },
            value: '',
            visible: true,
            validation: {
                required: true,
                dateOfBirth: true,
            },
            errorMessage: 'Please enter a valid DOB. You must be 18 years of age or older',
            valid: false,
        },
        profession: {
            elementType: 'dropdown',
            elementConfig: {
                name: 'profession',
                placeholder: 'Profession/Industry',
                autoCapitalize: 'none',
                blurOnSubmit: false,
            },
            value: '',
            visible: true,
            validation: {
                required: true,
            },
            errorMessage: 'Please select a profession/industry',
            valid: false,
            data: [
                { id: 0, type: 'IT Industry' },
                { id: 1, type: 'Engineer' },
                { id: 2, type: 'Business Man' },
            ],
        },
        password: {
            elementType: 'input',
            elementConfig: {
                name: 'password',
                placeholder: 'Password',
                blurOnSubmit: true,
            },
            value: '',
            visible: true,
            validation: {
                required: true,
            },
            valid: false,
            errorMessage: 'Please enter a valid password',
            headerMessage: 'Create Password',
        },
        confirmPassword: {
            elementType: 'input',
            elementConfig: {
                name: 'confirmPassword',
                placeholder: 'Confirm Password',
                blurOnSubmit: true,
            },
            value: '',
            visible: true,
            validation: {
                required: true,
            },
            valid: false,
            errorMessage: 'Password does not match',
        },
    });


    const [formIsValid, setFormIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseError, setResponseError] = useState('');
    const [showError, setShowError] = useState(false);
    const [genderModal, setGenderModal] = useState(false);
    const [professionModal, setProfessionModal] = useState(false);
    const [professionData, setProfessionData] = useState([]);
    const [date, setDate] = useState('');
    const [show, setShow] = useState(false);
    const [professionID, setProfessionID] = useState('');

    useEffect(() => {
        getProfessionModal();
    }, []);

    const getProfessionModal = async () => {
        try {
            const { data } = await Service.getProfession();
            setProfessionData(data);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        }
    };

    const handleLogin = async () => {
        if (loginForm.password.value !== loginForm.confirmPassword.value) {
            setResponseError('Password does not match');
            return;
        }
        Keyboard.dismiss();
        if (formIsValid) {
            setLoading(true);
            const updatedData = {
                cell_no: number,
                name: loginForm.name.value,
                dateOfBirth: loginForm.DOB.value,
                profession: professionID,
                gender: loginForm.gender.value,
                password: loginForm.password.value,
                confirmPassword: loginForm.confirmPassword.value,
            };
            try {
                await signup(updatedData);
            } catch (error) {
                if (error === 'invalid_grant') {
                    setResponseError('Invalid username or password');
                } else {
                    setResponseError(error);
                }
                console.trace('Inside Catch => ', error);
            }
            finally {
                setLoading(false);
            }
        } else {
            setShowError(true);
            setLoading(false);
            // setResponseError('Invalid username or password');
        }
    };

    const emailRE = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g);

    const checkValidity = (value, validation) => {
        let isValid = true;
        // if (typeof value !== '')
        if (validation.required) {
            isValid = value?.trim() !== '' && isValid;
        }
        if (validation.lowerCase) {
            value = value.toLowerCase();
            isValid = isNaN(value) && isValid;
        }
        if (validation.email) {
            isValid = emailRE.test(value) && isValid;
        }
        if (validation.dateOfBirth) {
            isValid = underAgeValidate(value) && isValid;
        }
        return isValid;
    };

    const inputChangeHandler = (inputID, value) => {
        // if (showError) setShowError(false);
        if (responseError) setResponseError('');
        const updatedForm = { ...loginForm };
        const updatedFormElement = {
            ...updatedForm[inputID],
        };
        updatedFormElement.value = value;
        updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
        // updatedFormElement.touched = true;
        if (updatedFormElement.valid) updatedFormElement.showError = false;
        else updatedFormElement.showError = true;
        updatedForm[inputID] = updatedFormElement;

        let updatedFormIsValid = true;
        for (let inputIdentifer in updatedForm) {
            updatedFormIsValid = updatedForm[inputIdentifer].valid && updatedFormIsValid;
        }
        updateLoginForm(updatedForm);
        setFormIsValid(updatedFormIsValid);
    };


    const pressHandler = (type) => {
        switch (type) {
            case 'gender':
                setGenderModal(true);
                break;
            case 'DOB':
                showDatepicker();
                // setTimeModalVisible(true);
                break;
            case 'profession':
                setProfessionModal(true);
                break;
            default:
                break;
        }
    };

    const modalPressHandler = (_type, _data) => {
        if (_type === 'gender') {
            // setGenderModalData(_data);
            inputChangeHandler(_type, _data.type);
            setGenderModal(false);
        }
        else if (_type === 'profession') {
            setProfessionID(_data.profession_id);
            inputChangeHandler(_type, _data.profession);
            setProfessionModal(false);
        }
    };

    //Date
    const onChange = (selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        inputChangeHandler('DOB', moment(currentDate).format('MM-DD-YYYY'));
        setDate(currentDate);
    };
    const showMode = (currentMode) => {
        setShow(true);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const formElementsArray = [];
    for (let key in loginForm) {
        formElementsArray.push({
            id: key,
            config: loginForm[key],
        });
    }
    let form = (
        formElementsArray.map(element => (
            <InputComponent
                inputStyle={{ padding: 3, paddingLeft: 10 }}
                key={element.id}
                elementType={element.config.elementType}
                elementConfig={element.config.elementConfig}
                leftIcon={element.config.leftIcon}
                value={element.config.value}
                shouldValidate={element.config.validation}
                visible={element.config.visible}
                change={inputChangeHandler.bind(this, element.id)}
                errorMessage={element.config.errorMessage}
                isValid={element.config.valid}
                headerMessage={element.config.headerMessage}
                showError={showError}
                ref={element.config.ref}
                // onSubmitHandler={onSubmitHandler}
                returnKeyType
                onPress={pressHandler.bind(this, element.config.elementConfig.name)}
            />
        ))
    );

    return (
        <ScrollView contentContainerStyle={styles.root} keyboardShouldPersistTaps="handled">
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.newSecondary }]} >
                <Image source={images.full_bg} resizeMode="contain" style={globalStyles.image} />
            </View>
            <View style={styles.main}>
                {form}
                {responseError ? (
                    <Typography new variant="semiBold" style={{ color: colors.warning, paddingTop: 10, alignSelf: 'center' }}>
                        {responseError}
                    </Typography>
                ) : null}
            </View>
            <View style={styles.footer} >
                <TouchableOpacity onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={1} style={styles.footerButton} >
                    {loading && <ActivityIndicator style={styles.loader} color={colors.newPrimary} size={24} />}
                    <Image source={images.footer_btn} style={globalStyles.image} resizeMode="cover" />
                </TouchableOpacity>
            </View>

            <Modal
                setVisible={setGenderModal}
                visible={genderModal}
            >
                <ModalList
                    data={loginForm.gender.data}
                    pressHandler={modalPressHandler.bind(this, 'gender')}
                    heading={'Select Gender'}
                />
            </Modal>
            <Modal
                setVisible={setProfessionModal}
                visible={professionModal}
            >
                <ModalList
                    data={professionData}
                    pressHandler={modalPressHandler.bind(this, 'profession')}
                    heading={'Select Your Profession/Industry'}
                />
            </Modal>
            <ModalDatePicker
                isVisible={show}
                value={date}
                mode="date"
                is24Hour={true}
                maximumDate={new Date()}
                display="spinner"
                onConfirm={onChange}
                onCancel={setShow.bind(this, false)}
            />
        </ScrollView>
    );
};

export default SignUp;
