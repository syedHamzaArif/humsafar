import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import SeatOrder from '#components/CreateRide/SeatOrder/SeatOrder';
import Confirm from '#components/CreateRide/Confirm/Confirm';
import images from '#assets/index';
import { BackHandler } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { showPopUpMessage } from '#util/';
import Loader from '#components/common/Loader';
import { Service } from '#config/service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './createRide.styles';
import Vehicle from '#components/CreateRide/Vehicle/Vehicle';
import Ride from '#components/CreateRide/Ride/Ride';
import Pricing from '#components/CreateRide/Pricing/Pricing';
import StepHeader from '#components/StepHeader';

const tabs = [
    {
        id: 0, heading: 'Create Ride',
        title: 'vehicle', image: images.create_ride_header_bg_1,
        component: Vehicle,
    },
    {
        id: 1, heading: 'Book Ride',
        title: 'ride', image: images.create_ride_header_bg_2,
        component: Ride,
    },
    {
        id: 2, heading: 'Pricing',
        title: 'pricing', image: images.create_ride_header_bg_3,
        component: Pricing,
    },
    {
        id: 3, heading: 'Seat Order',
        title: 'order', image: images.create_ride_header_bg_4,
        component: SeatOrder,
    },
    {
        id: 4, heading: 'Confirm',
        title: 'confirm', image: images.create_ride_header_bg_1,
        component: Confirm,
    },
];

const CreateRide = ({ navigation }) => {
    const scrollViewRef = useRef(null);

    const [step, setStep] = useState(0);
    const [stepHistory, setStepHistory] = useState([0]);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        vehicle: {
            carType: { frontEndValue: 'HatchBack', backEndValue: 1 },
            maker: { frontEndValue: 'Maker', backEndValue: null },
            model: { frontEndValue: 'Model', backEndValue: null },
            year: { frontEndValue: 'Year', backEndValue: null },
            reg_Number: '',
            nic_front: [],
            nic_back: [],
            car_papers: [],
            driver_license: [],
        },
        ride: {
            time: '',
            date: '',
            startRegion: {
                frontEndValue: {
                    latitude: 30.3753,
                    longitude: 69.3451,
                    latitudeDelta: 15.0,
                    longitudeDelta: 15.0,
                },
                backEndValue: '',
                cityLocation: '',
            },
            destinationRegion: {
                frontEndValue: {
                    latitude: 30.3753,
                    longitude: 69.3451,
                    latitudeDelta: 15.0,
                    longitudeDelta: 15.0,
                },
                backEndValue: '',
                cityLocation: '',
                isLocation: false,
            },
            allLocationData: {
                latitude: 30.3753,
                longitude: 69.3451,
                latitudeDelta: 15.0,
                longitudeDelta: 15.0,
            },

        },
        pricing: {
            isAc: true,
            isLuggage: false,
            isSmoking: false,
            isMusic: false,
            passengerPreference: 1,
            male: '',
            female: '',
            child: '',
            seatsAvailable: '',
            specialNote: '',
            perSeat: '',
            fullCar: '',
            isEnabled: '',
        },
    });
    const [seatingCapacity, setSeatingCapacity] = useState(null);
    const [passengerPreferences, setPassengerPreferences] = useState([]);
    const [seatingOrder, setSeatingOrder] = useState([]);
    const [modelData, setModelData] = useState([]);
    const [yearsData, setYearsData] = useState([]);
    const [makerData, setMakerData] = useState([]);
    const [vehicleTypeData, setVehicleTypeData] = useState([]);


    const tabPressHandler = _step => {
        if (_step > step) nextHandler(_step);
        else backwardStep(_step);
    };

    const nextHandler = newStep => {
        let temp;
        if (step === 0) {
            temp = state.vehicle;
        }
        else if (step === 1) {
            temp = state.ride;
        }
        else if (step === 2) {
            temp = state.pricing;
        }
        if (step === 0 && (!temp.maker.backEndValue || !temp.model.backEndValue || !temp.year.backEndValue || !temp.reg_Number
            || temp.nic_front.length === 0 || temp.nic_back.length === 0 || temp.car_papers.length === 0 || temp.driver_license.length === 0)) {

            showPopUpMessage('Failed', 'All fields required', 'danger');
            return;
        }
        else if (step === 1 && (!temp.date || !temp.time || !temp.startRegion.backEndValue || !temp.destinationRegion.backEndValue)) {

            showPopUpMessage('Failed', 'All fields required', 'danger');
            return;
        }
        else if (step === 2) {
            if (!temp.seatsAvailable) {
                showPopUpMessage('Failed', 'seat availability field required', 'danger');
                return;
            } else if (!temp.perSeat) {
                showPopUpMessage('Failed', 'Per seat price required', 'danger');
                return;
            }
            else if (!temp.fullCar) {
                showPopUpMessage('Failed', 'Full car price required', 'danger');
                return;
            }
        }
        if (step < 4) {
            if (newStep) {
                const stepDifference = newStep - Math.max(...stepHistory);
                if (stepDifference === 1 || stepHistory.some(item => +item === newStep)) {
                    setStep(newStep);
                    setStepHistory(_history => [..._history, newStep]);
                } else return;
            } else {
                setStep(step + 1);
                setStepHistory(_history => [..._history, step + 1]);
            }
            scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
        }
        else {
            navigation.navigate('Home');
        }
    };

    const backwardStep = _step => {
        setStep(_step ?? step - 1);
    };

    const resultHandler = () => {
        if (step === 0) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'Home' },
                    ],
                })
            );
        } else {
            backwardStep();
        }
        return true;
    };


    const backPressHandler = () => {
        if (step > 0) {
            setStep(_step => _step - 1);
            return true;
        } else return false;
    };

    const setSeatingOrderHandler = () => {
        const updatedSeatingOrderList = [];
        let updatedWithPassengerCount = +state.pricing.male + +state.pricing.female + +state.pricing.child;
        let updatedSeatsAvailable = +state.pricing.seatsAvailable;

        for (let index = 0; index <= seatingCapacity; index++) {
            if (index === 1) {
                updatedSeatingOrderList[index] = 'driver';
            } else if (updatedWithPassengerCount !== 0) {
                updatedSeatingOrderList[index] = 'with-driver';
                updatedWithPassengerCount--;
            } else if (updatedSeatsAvailable !== 0) {
                updatedSeatingOrderList[index] = 'passenger';
                updatedSeatsAvailable--;
            } else {
                updatedSeatingOrderList[index] = 'empty';
            }
        }
        setSeatingOrder(updatedSeatingOrderList);
    };

    useEffect(() => {
        setSeatingOrderHandler();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seatingCapacity, state.pricing.seatsAvailable, state.pricing.male, state.pricing.female, state.pricing.child]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', resultHandler);
        return () => backHandler.remove();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    const multiStateChange = (_page, _value) => {
        const updatedState = { ...state };
        updatedState[_page] = _value;
        setState(updatedState);
    };

    const setStateChange = (_page, _name, _value, _backEndValue, _cityLocation, _isLocation) => {

        try {
            const updatedState = { ...state };
            const updatedStateItem = { ...updatedState[_page] };
            if (_name === 'carType' || _name === 'maker' || _name === 'year' || _name === 'model') {
                updatedStateItem[_name].frontEndValue = _value;
                updatedStateItem[_name].backEndValue = _backEndValue;
            } else if (_name === 'startRegion' || _name === 'destinationRegion') {
                updatedStateItem[_name].frontEndValue = _value;
                updatedStateItem[_name].backEndValue = _backEndValue;
                updatedStateItem[_name].cityLocation = _cityLocation;
                updatedStateItem[_name].isLocation = _isLocation;
            } else {
                updatedStateItem[_name] = _value;
            }
            if (_name === 'carType' || _name === 'maker') {
                updatedStateItem.model.frontEndValue = 'Model';
                updatedStateItem.model.backEndValue = null;
            }
            updatedState[_page] = updatedStateItem;
            setState(updatedState);
        } catch (_error) {
            console.trace('Inside Catch => ', _error);
        }
    };

    const getPreferencesList = async () => {
        try {
            const { data } = await Service.getPassengerPreferences();
            setPassengerPreferences(data);
        } catch (err) {
            console.trace('Inside Catch => ', err);
        }
    };

    const getModelHandler = async (_carType, _manufactureID) => {
        try {
            const queryParams = { vehicleTypeId: _carType ?? state.vehicle.carType.backEndValue, manufacturerId: _manufactureID ?? state.vehicle.maker.backEndValue };
            const { data } = await Service.getModel(queryParams);
            setModelData(data);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        }
    };

    const getYearsHandler = async (_vehID) => {
        try {
            const { data } = await Service.getYear();
            setYearsData(data);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        }
    };

    const getMakerHandler = async (_vehID) => {
        try {
            const { data } = await Service.getMaker();
            setMakerData(data);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        }
    };

    const getUserVehicle = async () => {
        try {
            const {
                data: {
                    vehicle_type,
                    vehicle_type_id,
                    model: _model,
                    vehicle_model_id,
                    manufacturer,
                    manufacturer_id,
                    year: _year,
                    vehicle_year_id,
                    reg_num,
                    user_vehicle_id,
                    nic_front: _nic_front,
                    nic_back: _nic_back,
                    license: _license,
                    papers: _papers,
                    model_seating_capacity,
                },
            } = await Service.getUserVehicle();

            const obj = {
                'carType': { frontEndValue: vehicle_type, backEndValue: vehicle_type_id },
                'maker': { frontEndValue: manufacturer, backEndValue: manufacturer_id },
                'model': { frontEndValue: _model, backEndValue: vehicle_model_id },
                'year': { frontEndValue: _year, backEndValue: vehicle_year_id },
                'user_vehicle_id': user_vehicle_id,
                'reg_Number': reg_num,
                'nic_front': [{ path: _nic_front }],
                'nic_back': [{ path: _nic_back }],
                'driver_license': [{ path: _license }],
                'car_papers': [{ path: _papers }],
            };

            multiStateChange('vehicle', obj);
            setSeatingCapacity(model_seating_capacity);

        } catch (error) {
            console.trace('Inside Catch => ', error);
        }
    };

    const getVehicleTypeHandler = async () => {
        try {
            const { data } = await Service.getVehicleTypes();
            setVehicleTypeData(data);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        }
    };

    const init = async () => {
        try {
            setLoading(true);
            await getPreferencesList();
            await getModelHandler();
            await getYearsHandler();
            await getMakerHandler();
            await getVehicleTypeHandler();
            await getUserVehicle();
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const Tab = tabs[step].component;

    return (
        <ScrollView ref={scrollViewRef} contentContainerStyle={[styles.root, { paddingBottom: useSafeAreaInsets().bottom }]}
            keyboardShouldPersistTaps="handled">
            {loading && <Loader />}
            <StepHeader tabs={tabs} navigation={navigation} tabPressHandler={tabPressHandler} step={step} />
            <Tab
                {...tabs[step]}
                state={state}
                stateChange={setStateChange.bind(this, tabs[step].title)}
                setSeatingCapacity={setSeatingCapacity}
                modelData={modelData}
                yearsData={yearsData}
                makerData={makerData}
                vehicleTypeData={vehicleTypeData}
                getModelHandler={getModelHandler}
                seatingCapacity={seatingCapacity}
                passengerPreferences={passengerPreferences}
                seatingOrder={seatingOrder}
                setSeatingOrder={setSeatingOrder}
                step={nextHandler}
                vehicleDetail={state.vehicle}
                pricingDetail={state.pricing}
                rideDetail={state.ride}
                goBack={navigation.goBack}
                user_vehicle_id={state.vehicle.user_vehicle_id}
            />
            <View style={styles.row}>
                {
                    step !== 0 && step !== tabs.length - 1 ?
                        <TouchableOpacity style={styles.back} activeOpacity={0.9} onPress={backPressHandler.bind(this, null)}>
                            <Typography new color={colors.white}>Back</Typography>
                        </TouchableOpacity> : <View />
                }
                {
                    step !== tabs.length - 1 ?
                        <TouchableOpacity style={styles.next} activeOpacity={0.9} onPress={nextHandler.bind(this, null)}>
                            <Typography new color={colors.white}>Next</Typography>
                        </TouchableOpacity> : null
                }
            </View>
        </ScrollView>
    );
};

export default CreateRide;
