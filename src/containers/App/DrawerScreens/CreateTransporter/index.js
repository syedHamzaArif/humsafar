import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Typography from '#components/common/Typography';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { colors } from '#res/colors';
import images from '#assets/index';
import { Service } from '#config/service';
import { showPopUpMessage } from '#util/';
import LoaderView from '#components/common/LoaderView';
import { BackHandler } from 'react-native';
import Vehicle from '#components/CreateRide/Vehicle/Vehicle';
import Ride from '#components/CreateTransport/Ride';
import AdditionalDetails from '#components/CreateTransport/AdditionalDetails';
import Confirm from '#components/CreateRide/Confirm/Confirm';
import StepHeader from '#components/StepHeader';
import RNGooglePlaces from 'react-native-google-places';
import { getAddressCustomer } from '#util/';

const defaultLocation = {
    latitude: 30.3753,
    longitude: 69.3451,
    latitudeDelta: 15.0,
    longitudeDelta: 15.0,
};

const defaultTransport = {
    startRegion: {
        frontEndValue: defaultLocation,
        backEndValue: '',
        cityLocation: '',
    },
    destinationRegion: {
        frontEndValue: defaultLocation,
        backEndValue: '',
        cityLocation: '',
        isLocation: false,
    },
    allLocationData: defaultLocation,
    price_per_seat: '',
    price_full_vehicle: '',
};

const tabs = [
    {
        id: 0, heading: 'Create Transport',
        title: 'vehicle', image: images.create_ride_header_bg_1,
        component: Vehicle,
    },
    {
        id: 1, heading: 'Routes',
        title: 'ride', image: images.create_ride_header_bg_2,
        component: Ride,
    },
    {
        id: 2, heading: 'Details',
        title: 'additionalDetails', image: images.create_ride_header_bg_3,
        component: AdditionalDetails,
    },
    {
        id: 3, heading: 'Confirm',
        title: 'confirm', image: images.create_ride_header_bg_1,
        component: Confirm,
    },
];

const CreateTransporter = ({ navigation }) => {
    const scrollViewRef = useRef(null);
    const mapRef = useRef(null);

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
        transports: [{ ...defaultTransport }],
        additionalDetails: {
            isAc: true,
            isLuggage: false,
            isSmoking: false,
            isMusic: false,
            specialNote: '',
        },
    });

    const [deleteTransports, setDeleteTransports] = useState([]);

    const [modelData, setModelData] = useState([]);
    const [yearsData, setYearsData] = useState([]);
    const [makerData, setMakerData] = useState([]);
    const [vehicleTypeData, setVehicleTypeData] = useState([]);

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

    const addTransportHandler = () => {
        const updatedTransports = [...state.transports];
        updatedTransports.push({
            startRegion: {
                frontEndValue: defaultLocation,
                backEndValue: '',
                cityLocation: '',
            },
            destinationRegion: {
                frontEndValue: defaultLocation,
                backEndValue: '',
                cityLocation: '',
                isLocation: false,
            },
            allLocationData: defaultLocation,
            price_per_seat: '',
            price_full_vehicle: '',
        });
        multiStateChange('transports', updatedTransports);
    };

    const removeTransportHandler = _index => {
        let _transports = [...state.transports];
        _transports = _transports.filter((_transport, index) => +index !== +_index);
        multiStateChange('transports', _transports);
        const { transporter_id } = state.transports.find((item, index) => +index === _index);
        if (transporter_id) {
            setDeleteTransports(ids => [...ids, transporter_id]);
        }
    };

    const transportsStateChange = (type, city, region, address, _currentIndex) => {
        const updatedTransports = [...state.transports];
        const updatedTransportsItem = { ...updatedTransports[_currentIndex] };
        updatedTransportsItem[type].frontEndValue = region;
        updatedTransportsItem[type].cityLocation = city;
        updatedTransportsItem[type].backEndValue = address;
        updatedTransports[_currentIndex] = updatedTransportsItem;
        multiStateChange('transports', updatedTransports);
    };

    const placesHandler = (_currentIndex, type) => {
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
                transportsStateChange(type, city, currentLocation, place.addressComponents[0].shortName, _currentIndex);
            })
            .catch(_error => console.trace(_error.message));
    };

    const priceChangeHandler = (type, index, value) => {
        const updatedTransports = [...state.transports];
        const updatedTransportsItem = { ...updatedTransports[index] };
        updatedTransportsItem[type] = value;
        updatedTransports[index] = updatedTransportsItem;
        multiStateChange('transports', updatedTransports);
    };

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const init = async () => {
        try {
            setLoading(true);
            await getModelHandler();
            await getYearsHandler();
            await getMakerHandler();
            await getVehicleTypeHandler();
            await getUserVehicle();
            await getUserTransports();
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            setLoading(false);
        }
    };

    const getUserTransports = async () => {
        try {
            const { data } = await Service.getUserTransports();

            if (!data?.length) return;

            const updatedData = [];
            for (const index in data) {
                const {
                    transporter_id, start_address, end_address, price_per_seat,
                    price_full_vehicle, from_city, to_city,
                } = data[index];
                updatedData.push({
                    transporter_id,
                    startRegion: {
                        frontEndValue: defaultLocation,
                        backEndValue: start_address,
                        cityLocation: from_city,
                    },
                    destinationRegion: {
                        frontEndValue: defaultLocation,
                        backEndValue: end_address,
                        cityLocation: to_city,
                        isLocation: false,
                    },
                    allLocationData: defaultLocation,
                    price_per_seat: price_per_seat.toString?.(),
                    price_full_vehicle: price_full_vehicle.toString?.(),
                });
            }

            const updatedAdditionalDetails = {
                isAc: data[0].is_ac,
                isSmoking: data[0].is_smoking,
                isLuggage: data[0].luggage,
                isMusic: data[0].is_music,
                specialNote: data[0].special_notes,
            };

            multiStateChange('additionalDetails', updatedAdditionalDetails);

            multiStateChange('transports', updatedData);

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

    const submitHandler = async () => {

        const {
            vehicle: { model: { frontEndValue: model, backEndValue: modelBackEndValue },
                year: { frontEndValue: year, backEndValue: yearBackEndValue },
                reg_Number,
                car_papers,
                nic_front,
                nic_back,
                driver_license,
                user_vehicle_id },
            additionalDetails: {
                isAc: is_ac,
                isLuggage: luggage,
                isSmoking: is_smoking,
                specialNote: special_notes,
                isMusic: is_music,
            },
            transports,
        } = state;

        try {
            setLoading(true);

            if (!modelBackEndValue || !yearBackEndValue || !reg_Number) {
                return showPopUpMessage('Failed', 'Provide all required fields');
            }
            if (!nic_front.length || !nic_back.length || !car_papers.length || !driver_license.length) {
                return showPopUpMessage('Failed', 'Provide all documents');
            }
            if (!transports.length || !transports[0].startRegion.cityLocation) {
                return showPopUpMessage('Failed', 'Provide at least one route');
            }

            let createUserVehicleObj = {
                vehicle_model_id: modelBackEndValue,
                vehicle_year_id: yearBackEndValue,
                reg_num: reg_Number,
                nic_front, nic_back, papers: car_papers, license: driver_license,
            };

            const formData = new FormData();
            for (const key in createUserVehicleObj) {
                const value = createUserVehicleObj[key];
                if (value && typeof value === 'object') {
                    if (!value[0].path.includes('http'))
                        formData.append(key, {
                            uri: value[0].path,
                            name: value[0].fileName,
                            type: value[0].type,
                        });
                } else {
                    formData.append(key, value);
                }
            }

            let result;
            let updatedVehicleId = user_vehicle_id;
            if (updatedVehicleId) {
                result = await Service.updateUserVehicle(formData);
            }
            else {
                result = await Service.userVehicle(formData);
                updatedVehicleId = result.data.user_vehicle_id;
            }

            let updatedTransports = [];

            for (const index in transports) {
                const {
                    transporter_id, price_per_seat, price_full_vehicle,
                    startRegion: { cityLocation: from_city, backEndValue: start_address },
                    destinationRegion: { cityLocation: to_city, backEndValue: end_address },
                } = transports[index];

                if (!start_address || !end_address || !price_per_seat || !price_full_vehicle || !from_city || !to_city) {
                    return showPopUpMessage('Failed', 'Provide required fields in routes');
                }

                let currentTransport = { start_address, end_address, price_per_seat, price_full_vehicle, from_city, to_city };
                if (transporter_id) currentTransport = { ...currentTransport, transporter_id };
                updatedTransports.push(currentTransport);
            }

            let createTransportObj = {
                vehicle_id: updatedVehicleId,
                luggage, is_smoking, is_ac,
                special_notes, is_music,
                transports: JSON.stringify(updatedTransports),
            };

            if (deleteTransports.length) {
                const { status } = await Service.deleteTransports(JSON.stringify(deleteTransports));
                if (!status) return showPopUpMessage('Failed', 'Unable to delete transports', 'danger');
            }

            const { status, message } = await Service.createTransporter(createTransportObj);
            if (status) {
                showPopUpMessage('Success', message, 'success');
                navigation.goBack();
            } else {
                throw 'Something went wrong';
            }

        } catch (error) {
            console.trace('Inside Catch => ', error);
            showPopUpMessage('Failed', typeof error === 'string' ? error : 'Something went wrong', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const tabPressHandler = _step => {
        if (_step > step) nextHandler(_step);
        else backPressHandler(_step);
    };


    const nextHandler = newStep => {
        if (step === 0) {
            if (!state.vehicle.year.backEndValue || !state.vehicle.model.backEndValue || !state.vehicle.reg_Number) {
                return showPopUpMessage('Failed', 'All fields are required', 'danger');
            }
            if (!state.vehicle.nic_front.length || !state.vehicle.nic_back.length || !state.vehicle.car_papers.length || !state.vehicle.driver_license.length) {
                return showPopUpMessage('Failed', 'All documents are required', 'danger');
            }
        } else if (step === 1) {
            if (!state.transports.length) {
                return showPopUpMessage('Failed', 'Provide at least one route', 'danger');
            }

            for (const index in state.transports) {
                const transport = state.transports[index];
                if (!transport.price_per_seat || !transport.price_full_vehicle || !transport.destinationRegion.backEndValue || !transport.startRegion.backEndValue) {
                    return showPopUpMessage('Failed', 'All fields are required', 'danger');
                }
            }
        }
        if (step < 3) {
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
    };

    const backPressHandler = newStep => {
        if (step > 0) {
            setStep(newStep ?? step - 1);
            return true;
        } else return false;
    };

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backPressHandler.bind(this, null));
        return backHandler.remove;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const Tab = tabs[step].component;

    return (
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.root} keyboardShouldPersistTaps="handled">
            {loading && <LoaderView />}

            <StepHeader navigation={navigation} step={step} tabPressHandler={tabPressHandler} tabs={tabs} />
            <Tab
                {...tabs[step]}
                state={state}
                setStateChange={setStateChange.bind(this, tabs[step].title)}
                stateChange={setStateChange.bind(this, tabs[step].title)}
                modelData={modelData}
                yearsData={yearsData}
                makerData={makerData}
                vehicleTypeData={vehicleTypeData}
                getModelHandler={getModelHandler}
                step={nextHandler}
                vehicleDetail={state.vehicle}
                pricingDetail={state.additionalDetails}
                transportDetail={state.transports}
                goBack={navigation.goBack}
                user_vehicle_id={state.vehicle.user_vehicle_id}
                ref={mapRef}
                addTransportHandler={addTransportHandler}
                removeTransportHandler={removeTransportHandler}
                transportsStateChange={transportsStateChange}
                placesHandler={placesHandler}
                priceChangeHandler={priceChangeHandler}
                submitHandler={submitHandler}
            />
            <View style={styles.row}>
                {
                    step !== 0 && step !== 3 ?
                        <TouchableOpacity style={styles.back} activeOpacity={0.9} onPress={backPressHandler.bind(this, null)}>
                            <Typography color={colors.white}>Back</Typography>
                        </TouchableOpacity> : <View />
                }
                {
                    step !== 3 ?
                        <TouchableOpacity style={styles.next} activeOpacity={0.9} onPress={nextHandler.bind(this, null)}>
                            <Typography color={colors.white}>Next</Typography>
                        </TouchableOpacity> : null
                }
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        backgroundColor: colors.white,
    },
    check: {
        // position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerBox: {
        width: '25%',
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: colors.backgroundPrimary,
        borderRightWidth: 0.25,
    },
    next: {
        width: responsiveWidth(30),
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        paddingVertical: responsiveHeight(2),
        marginBottom: responsiveHeight(1),
        borderBottomLeftRadius: 30,
        borderTopLeftRadius: 10,
    },
    back: {
        width: responsiveWidth(30),
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        paddingVertical: responsiveHeight(2),
        marginBottom: responsiveHeight(1),
        borderBottomRightRadius: 30,
        borderTopRightRadius: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalStyle: {
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: responsiveWidth(5),
        paddingVertical: responsiveHeight(5),
    },
    cameraButton: {
        // width: '90%',
        backgroundColor: colors.primary,
        alignItems: 'center',
        paddingVertical: responsiveHeight(1),
        borderRadius: 8,
        marginHorizontal: responsiveWidth(10),
    },
});

export default CreateTransporter;
