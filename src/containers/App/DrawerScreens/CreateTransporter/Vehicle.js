import images from '#assets/';
import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getFonts } from '#util/';
import Config from 'react-native-config';

const Vehicle = ({
    state, stateChange, vehicleTypeData, getModelHandler, setMakerModal,
    setModelModal, setYearModal, setSelectedImage,
    setModalVisible, vehicleDocumentsHandler,
}) => {


    const chooseCarFilterHandler = (_filter, name) => {
        stateChange('carType', name, _filter);
        getModelHandler(_filter);
    };

    return (
        <View style={styles.root}>
            <Typography size={12} color={colors.secondary} variant="semiBold">Choose your car type</Typography>
            <View style={[styles.row, { marginVertical: responsiveHeight(2) }]}>
                {
                    vehicleTypeData.map((item, index) => (
                        <View key={`vehicleType${index}`} style={{ width: '24%' }}>
                            <TouchableOpacity
                                style={[
                                    styles.chooseCarButton,
                                    { backgroundColor: state.carType.backEndValue === item.vehicle_type_id ? colors.secondary : colors.white },
                                ]}
                                onPress={chooseCarFilterHandler.bind(this, item.vehicle_type_id, item.vehicle_type)}
                            >
                                <FastImage resizeMode="contain" source={{ uri: Config.SERVER + item.image }} style={{ width: '100%', height: 55 }} />
                            </TouchableOpacity>
                            <Typography style={{ marginTop: responsiveHeight(1) }}
                                align="center" size={11} color={colors.secondary}
                                variant="semiBold">
                                {item.vehicle_type}
                            </Typography>
                        </View>
                    ))
                }
            </View>
            <View style={[styles.row, { marginTop: responsiveHeight(2) }]}>
                <TouchableOpacity style={styles.input} onPress={() => setMakerModal(true)} activeOpacity={0.7}>
                    <Typography variant="semiBold">{state.maker.frontEndValue ? state.maker.frontEndValue : 'Maker'}</Typography>
                </TouchableOpacity>
                <TouchableOpacity style={styles.input} onPress={() => setModelModal(true)} activeOpacity={0.7}>
                    <Typography variant="semiBold">{state.model.frontEndValue ? state.model.frontEndValue : 'Model'}</Typography>
                </TouchableOpacity>
            </View>
            <View style={[styles.row, { marginTop: responsiveHeight(2) }]}>
                <TextInput
                    style={styles.input}
                    value={state.reg_Number}
                    placeholder={'Number Plate'}
                    placeholderTextColor={colors.textLight}
                    onChangeText={(text) => stateChange('reg_Number', text)}
                    keyboardType="default"
                    autoCapitalize="characters"
                />
                <TouchableOpacity style={styles.input} onPress={() => setYearModal(true)} activeOpacity={0.7}>
                    <Typography variant="semiBold">{state.year.frontEndValue ? state.year.frontEndValue : 'Year'}</Typography>
                </TouchableOpacity>
            </View>
            <View style={styles.attachmentRow}>
                <TouchableOpacity
                    style={[styles.imagePress, { flex: 1 }]}
                    activeOpacity={0.7}
                    onPress={() => {
                        setModalVisible(true);
                        setSelectedImage('car_papers');
                    }}>
                    <Typography size={13} variant="semiBold">Car Papers</Typography>
                    {
                        state.car_papers.length ? null :
                            <FastImage resizeMode="contain" source={images.plus} style={{ width: 25, height: 25 }} />
                    }
                </TouchableOpacity>
                {
                    state.car_papers.length > 0 ?
                        <TouchableOpacity activeOpacity={0.7} style={{ width: 40, height: 40, margin: 5 }}
                            onPress={vehicleDocumentsHandler.bind(this, state.car_papers[0]?.path)}>
                            <FastImage
                                style={{ width: null, height: null, flex: 1 }}
                                source={{ uri: state.car_papers[0]?.path }}
                                resizeMethod="scale"
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                        : null
                }
            </View>
            <View style={styles.attachmentRow}>
                <TouchableOpacity
                    style={[styles.imagePress, { flex: 1 }]}
                    activeOpacity={0.7}
                    onPress={() => {
                        setModalVisible(true);
                        setSelectedImage('nic_front');
                    }}>
                    <Typography size={13} variant="semiBold">NIC Front</Typography>
                    {
                        state.nic_front.length ? null :
                            <FastImage resizeMode="contain" source={images.plus} style={{ width: 25, height: 25 }} />
                    }
                </TouchableOpacity>
                {
                    state.nic_front.length > 0 ?
                        <TouchableOpacity activeOpacity={0.7} style={{ width: 40, height: 40, margin: 5 }}
                            onPress={vehicleDocumentsHandler.bind(this, state.nic_front[0]?.path)}>
                            <FastImage
                                style={{ width: null, height: null, flex: 1 }}
                                source={{ uri: state.nic_front[0]?.path }}
                                resizeMethod="scale"
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                        : null
                }
            </View>
            <View style={styles.attachmentRow}>
                <TouchableOpacity
                    style={[styles.imagePress, { flex: 1 }]}
                    activeOpacity={0.7}
                    onPress={() => {
                        setModalVisible(true);
                        setSelectedImage('nic_back');
                    }}>
                    <Typography size={13} variant="semiBold">NIC Back</Typography>
                    {
                        state.nic_back.length ? null :
                            <FastImage resizeMode="contain" source={images.plus} style={{ width: 25, height: 25 }} />
                    }
                </TouchableOpacity>
                {
                    state.nic_back.length > 0 ?
                        <TouchableOpacity activeOpacity={0.7} style={{ width: 40, height: 40, margin: 5 }}
                            onPress={vehicleDocumentsHandler.bind(this, state.nic_back[0]?.path)}>
                            <FastImage
                                style={{ width: null, height: null, flex: 1 }}
                                source={{ uri: state.nic_back[0]?.path }}
                                resizeMethod="scale"
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                        : null
                }
            </View>
            <View style={styles.attachmentRow}>
                <TouchableOpacity
                    style={[styles.imagePress, { flex: 1 }]}
                    activeOpacity={0.7}
                    onPress={() => {
                        setModalVisible(true);
                        setSelectedImage('driver_license');
                    }}>
                    <Typography size={13} variant="semiBold">Drivers License</Typography>
                    {
                        state.driver_license.length ? null :
                            <FastImage resizeMode="contain" source={images.plus} style={{ width: 25, height: 25 }} />
                    }
                </TouchableOpacity>
                {
                    state.driver_license.length > 0 ?
                        <TouchableOpacity activeOpacity={0.7} style={{ width: 40, height: 40, margin: 5 }}
                            onPress={vehicleDocumentsHandler.bind(this, state.driver_license[0]?.path)}>
                            <FastImage
                                style={{ width: null, height: null, flex: 1 }}
                                source={{ uri: state.driver_license[0]?.path }}
                                resizeMethod="scale"
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                        : null
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveHeight(3),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chooseCarButton: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 8,
        paddingHorizontal: responsiveHeight(0.5),
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 4,
        borderColor: colors.primaryGrey,
        borderWidth: 0.5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        color: colors.textPrimary,
        paddingHorizontal: responsiveWidth(3),
        width: '47%',
        height: responsiveHeight(5),
        justifyContent: 'center',
        fontFamily: getFonts().semiBold,
    },
    imagePress: {
        padding: 2,
        backgroundColor: colors.white,
        borderRadius: 4,
        borderColor: colors.primaryGrey,
        borderWidth: 0.5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        color: colors.textPrimary,
        paddingHorizontal: responsiveWidth(3),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
    },
    attachmentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveHeight(2),
    },

});

export default Vehicle;
