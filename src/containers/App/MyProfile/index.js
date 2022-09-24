import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import { responsiveHeight } from '#util/responsiveSizes';
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { responsiveSize } from '#util/';
import { Service, getToken } from '#config/service';
import Button from '#components/common/Button';
import { AuthContext } from '#context/';
import { View } from 'react-native';
import InputComponent from '#components/common/Input';
import Modal from '#components/common/Modal';
import ModalList from '#components/common/ModalList';
import ModalDatePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { showPopUpMessage } from '#util/';
import { updatedata } from '#redux/actions/actionCreators';

const MyProfile = ({ navigation }) => {
    const { userData } = useSelector(state => state.userReducer);
    const { name, id } = userData;

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
            valid: true,
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
            errorMessage: 'Please enter a valid Gender Type',
            valid: true,
            data: [
                { id: 0, type: 'Male' },
                { id: 0, type: 'Female' },
            ],
        },
        dateOfBirth: {
            elementType: 'dropdown',
            elementConfig: {
                name: 'dateOfBirth',
                placeholder: 'dateOfBirth',
                autoCapitalize: 'none',
                blurOnSubmit: false,
            },
            value: '',
            visible: true,
            validation: {
                required: true,
            },
            errorMessage: 'Please enter a valid dateOfBirth',
            valid: true,
        },
        profession: {
            elementType: 'dropdown',
            elementConfig: {
                name: 'profession',
                placeholder: 'Profession',
                autoCapitalize: 'none',
                blurOnSubmit: false,
            },
            value: '',
            visible: true,
            validation: {
                required: true,
            },
            errorMessage: 'Please enter a valid profession',
            valid: true,
        },
    });

    const [isLoading, setIsLoading] = useState(false);
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
    const [profileData, setProfileData] = useState({});
    const dispatch = useDispatch();
    const updateUserData = (data) => dispatch(updatedata(data));


    useEffect(() => {
        getProfileHandler(id);
        getProfessionModal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const inputChangeHandler = (inputID, value) => {
        if (inputID === 'name' || inputID === 'gender' || inputID === 'profession') {
            if (showError) setShowError(false);
            if (responseError) setResponseError('');
            const updatedForm = { ...loginForm };
            const updatedFormElement = {
                ...updatedForm[inputID],
            };
            updatedFormElement.value = value;
            // updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
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
        }
    };



    const getProfileHandler = async (_id) => {
        setIsLoading(true);
        try {
            const { data } = await Service.getProfile(_id);
            data.dateOfBirth = moment(new Date(data.dateOfBirth), 'MM-DD-YYYY');
            setProfileData(data);
            const updatedForm = { ...loginForm };
            for (const key in updatedForm) {
                const element = updatedForm[key];
                if (data[key]) {
                    element.value = key === 'dateOfBirth' ? moment(data[key]).format('MM-DD-YYYY') : data[key];
                }

            }
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getProfessionModal = async () => {
        try {
            const { data } = await Service.getProfession();
            setProfessionData(data);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        }
    };

    const hasDataChanged = (_data) => {
        for (const key in _data) { if (_data[key] !== profileData[key]) return true; }
        return false;
    };

    const onSubmit = async () => {

        const updatedData = {
            name: loginForm.name.value,
            dateOfBirth: loginForm.dateOfBirth.value,
            profession: loginForm.profession.value,
            gender: loginForm.gender.value,
        };

        const changes = hasDataChanged(updatedData);

        if (!changes) return setResponseError('No Changes Made');

        updatedData.profession = professionID;

        setLoading(true);
        try {
            const { status } = await Service.updateProfile(updatedData);
            if (status) {
                const updatedToken = await getToken();
                const { data } = await Service.userInfo(updatedToken);
                if (JSON.stringify(data) === JSON.stringify(userData)) {

                } else {
                    let updatedUserData = { name: 'userData', value: { ...data } };
                    updateUserData(updatedUserData);
                }
                showPopUpMessage('Success', 'Successfully updated user', 'success');
            } else {
                showPopUpMessage('Failed', 'Something went wrong');
            }
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            setLoading(false);
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
        return isValid;
    };

    const pressHandler = (type) => {
        switch (type) {
            case 'gender':
                setGenderModal(true);
                break;
            case 'dateOfBirth':
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

    const onChange = (selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        inputChangeHandler('dateOfBirth', moment(currentDate).format('MM-DD-YYYY'));
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
    };

    const showDatepicker = () => {
        showMode('date');
    };


    const changePasswordHandler = async () => {
        navigation.navigate('Change Password');
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
        <ScrollView contentContainerStyle={[styles.root]} keyboardShouldPersistTaps="handled">
            {
                <>
                    <Typography new size={20}
                        variant="semiBold">
                        {`Hello ${name}!`}
                    </Typography>

                    <View style={{ marginTop: responsiveHeight(5) }}>
                        {form}
                    </View>

                    <Button style={{ marginBottom: responsiveHeight(1), backgroundColor: colors.newAccent }}
                        textStyle={{ color: colors.newSecondary }}
                        loading={loading} onPress={onSubmit} title="Update Profile" />
                    {responseError ? (
                        <Typography new variant="semiBold" style={{ color: colors.warning, paddingTop: 10, alignSelf: 'center' }}>
                            {responseError}
                        </Typography>
                    ) : null}

                    <TouchableOpacity activeOpacity={1} onPress={changePasswordHandler}>
                        <Typography new
                            style={styles.changePassword} variant="bold" >
                            Change Password
                        </Typography>
                    </TouchableOpacity>
                    <Modal
                        setVisible={setGenderModal}
                        visible={genderModal}
                    >
                        <ModalList
                            data={loginForm.gender.data}
                            pressHandler={modalPressHandler.bind(this, 'gender')}
                            heading={'Select Gender Type'}
                        />
                    </Modal>
                    <Modal
                        setVisible={setProfessionModal}
                        visible={professionModal}
                    >
                        <ModalList
                            data={professionData}
                            pressHandler={modalPressHandler.bind(this, 'profession')}
                            heading={'Select Your Profession'}
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
                </>
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        // marginHorizontal: 20,
        // marginVertical: 10,
        padding: responsiveSize(3),
        backgroundColor: colors.backgroundWhite,
    },
    input: {
        backgroundColor: colors.white,
        borderColor: colors.black,
        borderWidth: 0.1,
        borderRadius: 1,
        padding: 4,
        color: colors.black,
    },
    changePassword: {
        marginVertical: 5,
        marginTop: responsiveHeight(4),
        marginRight: 12,
        alignSelf: 'flex-end',
    },
});

export default MyProfile;
