import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, TextInput, PermissionsAndroid } from 'react-native';
import Typography from '#components/common/Typography';
import { responsiveFontSize, responsiveHeight } from '#util/responsiveSizes';
import { colors } from '#res/colors';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-crop-picker';
import { width } from '#util/';
import Modal from '#components/common/Modal';
import ModalList from '#components/common/ModalList';
import LoaderView from '#components/common/LoaderView';
import ImageModal from '#components/common/ImageModal';
import FastImage from 'react-native-fast-image';
import { Platform } from 'react-native';
import Config from 'react-native-config';
import styles from './vehicle.style';

const Vehicle = ({ state, title, stateChange, setSeatingCapacity, modelData, yearsData, makerData, getModelHandler, vehicleTypeData }) => {
    const {
        carType: { frontEndValue: carType, backEndValue: carTypeBackEndValue },
        maker: { frontEndValue: maker, backEndValue: makerBackEndValue },
        model: { frontEndValue: model, backEndValue: modelBackEndValue },
        year: { frontEndValue: year, backEndValue: yearBackEndValue },
        reg_Number, nic_front, nic_back, driver_license, car_papers,
    } = state[title];

    const [modalVisible, setModalVisible] = useState(false);
    const [makerModal, setMakerModal] = useState(false);
    const [modelModal, setModelModal] = useState(false);
    const [yearModal, setYearModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState('car_papers');
    const [imageCarouselModalVisible, setImageCarouselModalVisible] = useState(false);
    const [vehicleDocuments, setVehicleDocuments] = useState('');

    const chooseCarFilterHandler = (_filter, name) => {
        stateChange('carType', name, _filter);
        getModelHandler(_filter);
    };

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const init = async () => {
        try {
            setLoading(true);
            await requestGetGalleryImages();
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            setLoading(false);
        }
    };

    const openImagePicker = () => {
        let imageList = [];

        ImagePicker.openPicker({
            multiple: false,
            waitAnimationEnd: false,
            includeBase64: true,
            includeExif: true,
            forceJpg: true,
            compressImageQuality: 0.8,
            maxFiles: 1,
            mediaType: 'photo',
            // cropping: true,
            width: width,
            height: width / 2,
        }).then(({ filename, path, data, mime }) => {
            const updatedName = filename ?? path.split('.')[path.split('.').length - 2];
            imageList.push({
                fileName: updatedName,
                path: path,
                data: data,
                type: mime,
            });
            stateChange(selectedImage, imageList);
            setModalVisible(false);
        })
            .catch((error) => console.trace('Error : ', error));
    };


    const openImageCamera = () => {
        let imageList = [];
        ImagePicker.openCamera({
            width: width,
            height: width / 2,
            cropping: true,
        }).then(image => {
            const updatedName = image.filename ?? image.path.split('.')[image.path.split('.').length - 2];
            imageList.push({
                fileName: updatedName,
                path: image.path,
                data: image.size,
                type: image.mime,
            });
            stateChange(selectedImage, imageList);
            setModalVisible(false);
        })
            .catch((error) => console.trace('Error : ', error));

    };

    const requestGetGalleryImages = async () => {
        if (Platform.OS === 'ios') return;
        try {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Permission Explanation',
                    message: 'We would like to access your photos!',
                },
            );
            if (result !== 'granted') {
                return;
            }
            CameraRoll.getPhotos({
                first: 5,
                assetType: 'Photos',
            })
                .then((res) => {
                    // this.setState({data: res.edges});
                    // setGetGallery({ getGallery: res.edges });
                })
                .catch((error) => {
                    console.trace(error);
                });
        } catch (err) {
            return 'false';
        }
    };

    const modalPressHandler = (_type, _data) => {

        if (_type === 'model') {
            if (makerBackEndValue !== _data.manufacturer_id) {
                stateChange('maker', _data.manufacturer, _data.manufacturer_id, 1);
            }
            stateChange('model', _data.model, _data.vehicle_model_id, 0);
            setSeatingCapacity?.(_data.model_seating_capacity);
            setModelModal(false);
        }
        else if (_type === 'maker') {
            stateChange('maker', _data.manufacturer, _data.manufacturer_id);
            getModelHandler(carTypeBackEndValue, _data.manufacturer_id);
            setMakerModal(false);
        }
        else if (_type === 'year') {
            stateChange('year', _data.year, _data.vehicle_year_id);
            setYearModal(false);
        }
    };

    const vehicleDocumentsHandler = (_images) => {
        setVehicleDocuments(_images);
        setImageCarouselModalVisible(true);
    };

    const imageUploadPressHandler = (_selectedImage) => {
        setModalVisible(true);
        setSelectedImage(_selectedImage);
    };

    return (
        loading ? <LoaderView />
            :
            <View style={styles.root} keyboardShouldPersistTaps="handled">
                <Typography new size={12} color={colors.newSecondary} variant="semiBold">Choose your car type</Typography>
                <View style={[styles.row, { marginVertical: responsiveHeight(2) }]}>
                    {
                        vehicleTypeData.map((item, index) => (
                            <View key={`vehicleType${index}`} style={{ width: '24%' }}>
                                <TouchableOpacity
                                    style={[
                                        styles.chooseCarButton,
                                        { backgroundColor: carTypeBackEndValue === item.vehicle_type_id ? colors.newSecondary : colors.newPrimary },
                                    ]}
                                    onPress={chooseCarFilterHandler.bind(this, item.vehicle_type_id, item.vehicle_type)}
                                >
                                    <FastImage resizeMode="contain" source={{ uri: Config.SERVER + item.image }} style={{ width: '100%', height: 55 }} />
                                </TouchableOpacity>
                                <Typography new style={{ marginTop: responsiveHeight(1) }}
                                    align="center" size={11} color={colors.newSecondary}
                                    variant="semiBold">
                                    {item.vehicle_type}
                                </Typography>
                            </View>
                        ))
                    }
                </View>
                <View style={styles.carDetailContainer} >
                    <View style={[styles.row]}>
                        <TouchableOpacity style={styles.input} onPress={() => setMakerModal(true)} activeOpacity={0.7}>
                            <Typography new color={colors.newPrimary} variant="semiBold">{maker ? maker : 'Maker'}</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.input} onPress={() => setModelModal(true)} activeOpacity={0.7}>
                            <Typography new color={colors.newPrimary} variant="semiBold">{model ? model : 'Model'}</Typography>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.row, { marginTop: responsiveHeight(2) }]}>
                        <TouchableOpacity style={styles.input} onPress={() => setYearModal(true)} activeOpacity={0.7}>
                            <Typography new color={colors.newPrimary} variant="semiBold">{year ? year : 'Year'}</Typography>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            value={reg_Number}
                            placeholder={'Number Plate'}
                            placeholderTextColor={colors.inactiveGray}
                            onChangeText={(text) => stateChange('reg_Number', text)}
                            keyboardType="default"
                            autoCapitalize="characters"
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.imagePress, { flex: 1 }]}
                    activeOpacity={0.7}
                    onPress={imageUploadPressHandler.bind(this, 'car_papers')}>
                    <Typography new size={13} variant="semiBold">Car Papers</Typography>
                    {
                        car_papers.length ?
                            <TouchableOpacity activeOpacity={0.7} style={{ width: 40, height: 40, margin: 5 }}
                                onPress={vehicleDocumentsHandler.bind(this, car_papers[0]?.path)}>
                                <FastImage
                                    style={{ width: null, height: null, flex: 1 }}
                                    source={{ uri: car_papers[0]?.path }}
                                    resizeMethod="scale"
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                            :
                            <Typography new size={responsiveFontSize(3)} >+</Typography>
                    }
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.imagePress, { flex: 1 }]}
                    activeOpacity={0.7}
                    onPress={imageUploadPressHandler.bind(this, 'nic_front')}>
                    <Typography new size={13} variant="semiBold">NIC Front</Typography>
                    {
                        nic_front.length ?
                            <TouchableOpacity activeOpacity={0.7}
                                style={styles.uploadedImage}
                                onPress={vehicleDocumentsHandler.bind(this, nic_front[0]?.path)}>
                                <FastImage
                                    style={{ width: null, height: null, flex: 1 }}
                                    source={{ uri: nic_front[0]?.path }}
                                    resizeMethod="scale"
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                            :
                            <Typography new size={responsiveFontSize(3)} >+</Typography>
                    }
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.imagePress, { flex: 1 }]}
                    activeOpacity={0.7}
                    onPress={imageUploadPressHandler.bind(this, 'nic_back')}>
                    <Typography new size={13} variant="semiBold">NIC Back</Typography>
                    {
                        nic_back.length ?
                            <TouchableOpacity activeOpacity={0.7} style={{ width: 40, height: 40, margin: 5 }}
                                onPress={vehicleDocumentsHandler.bind(this, nic_back[0]?.path)}>
                                <FastImage
                                    style={{ width: null, height: null, flex: 1 }}
                                    source={{ uri: nic_back[0]?.path }}
                                    resizeMethod="scale"
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                            :
                            <Typography new size={responsiveFontSize(3)} >+</Typography>
                    }
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.imagePress, { flex: 1 }]}
                    activeOpacity={0.7}
                    onPress={imageUploadPressHandler.bind(this, 'driver_license')}>
                    <Typography new size={13} variant="semiBold">Drivers License</Typography>
                    {
                        driver_license.length ?
                            <TouchableOpacity activeOpacity={0.7} style={{ width: 40, height: 40, margin: 5 }}
                                onPress={vehicleDocumentsHandler.bind(this, driver_license[0]?.path)}>
                                <FastImage
                                    style={{ width: null, height: null, flex: 1 }}
                                    source={{ uri: driver_license[0]?.path }}
                                    resizeMethod="scale"
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                            :
                            <Typography new size={responsiveFontSize(3)} >+</Typography>
                    }
                </TouchableOpacity>
                <Modal
                    setVisible={setModalVisible}
                    visible={modalVisible}
                    style={{ justifyContent: 'flex-end', margin: 0 }}
                >
                    <View style={styles.modalStyle}>
                        <TouchableOpacity style={styles.cameraButton} onPress={openImageCamera}>
                            <Typography new color={colors.secondary} variant="semiBold">Open Camera</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.cameraButton, { marginTop: responsiveHeight(2) }]} onPress={openImagePicker}>
                            <Typography new color={colors.secondary} variant="semiBold">Open Gallery</Typography>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <Modal
                    setVisible={setMakerModal}
                    visible={makerModal}
                >
                    <ModalList
                        name="Makers"
                        data={makerData}
                        pressHandler={modalPressHandler.bind(this, 'maker')}
                        heading={'Select your vehicle maker'}
                        setVisible={setMakerModal}
                    />
                </Modal>
                <Modal
                    setVisible={setModelModal}
                    visible={modelModal}
                >
                    <ModalList
                        name="Models"
                        data={modelData}
                        pressHandler={modalPressHandler.bind(this, 'model')}
                        heading={'Select your vehicle Model'}
                        setVisible={setModelModal}
                    />
                </Modal>
                <Modal
                    setVisible={setYearModal}
                    visible={yearModal}
                    style={{ marginVertical: responsiveHeight(16) }}
                >
                    <ModalList
                        name="Years"
                        data={yearsData}
                        pressHandler={modalPressHandler.bind(this, 'year')}
                        heading={'Select your vehicle year'}
                        setVisible={setYearModal}
                    />
                </Modal>
                <Modal
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    backdropOpacity={0.9}
                    setVisible={setImageCarouselModalVisible}
                    style={{ padding: 0, margin: 0 }}
                    visible={imageCarouselModalVisible} >
                    <ImageModal
                        modalVisible={setImageCarouselModalVisible}
                        image={vehicleDocuments}
                    />
                </Modal>
            </View>
    );
};

export default Vehicle;
