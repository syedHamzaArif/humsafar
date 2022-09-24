import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import images from '#assets/';
import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import { Checkbox } from 'react-native-paper';
import Button from '#components/common/Button';
import { height } from '#util/';
import moment from 'moment';
import ModalDatePicker from 'react-native-modal-datetime-picker';

const BookRideFilter = ({ type = 'ride', closeModal, state, applyFilterHandler }) => {

    const [show, setShow] = useState(false);
    const [showTo, setShowTo] = useState(false);

    const [filters, setFilters] = useState({ ...state });

    //From Date
    const onChange = (selectedDate) => {
        const currentDate = selectedDate || filters.fromDate;
        setShow(false);
        filterStateChangeHandler('fromDate', moment(currentDate).format('MM-DD-YYYY'));
    };
    const showMode = (currentMode) => {
        setShow(true);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    //To Date
    const onChangeTo = (selectedDate) => {
        const currentDate = selectedDate || filters.toDate;
        setShow(false);
        filterStateChangeHandler('toDate', moment(currentDate).format('MM-DD-YYYY'));
    };
    const showModeTo = (currentMode) => {
        setShowTo(true);
    };

    const showDateToPicker = () => {
        showModeTo('date');
    };

    const filterStateChangeHandler = (_name, _value) => {
        try {
            const updatedState = { ...filters };
            updatedState[_name].value = _value;
            setFilters(updatedState);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        }
    };


    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <Typography variant="medium" size={16} style={{ padding: responsiveHeight(1) }} color={colors.white}>Filter Search Results</Typography>
            </View>


            <View style={styles.row}>
                <View style={styles.box}>
                    <Checkbox.Android status={filters.isAc.value ? 'checked' : 'unchecked'}
                        onPress={() => { filterStateChangeHandler('isAc', !filters.isAc.value); }}
                        color={colors.secondaryGreen}
                    />
                    <Typography size={10} variant="semiBold">Air Condition</Typography>
                </View>
                <View style={styles.box}>
                    <Checkbox.Android status={filters.isLuggage.value ? 'checked' : 'unchecked'}
                        onPress={() => { filterStateChangeHandler('isLuggage', !filters.isLuggage.value); }}
                        color={colors.secondaryGreen}
                    />
                    <Typography size={10} variant="semiBold">Luggage</Typography>
                </View>
                <View style={styles.box}>
                    <Checkbox.Android status={filters.isSmoking.value ? 'checked' : 'unchecked'}
                        onPress={() => { filterStateChangeHandler('isSmoking', !filters.isSmoking.value); }}
                        color={colors.secondaryGreen}
                    />
                    <Typography size={10} variant="semiBold">Smoking</Typography>
                </View>
            </View>

            <View style={[styles.row, { marginVertical: responsiveHeight(2), width: '100%', marginHorizontal: 10 }]}>
                <Image source={images.FromToLine} resizeMode="contain" style={{ width: 20, height: 80 }} />
                <View style={{ width: '100%', marginHorizontal: 10 }}>
                    <View style={[styles.row, { justifyContent: 'space-between', width: '80%' }]}>
                        <View>
                            <Typography color={colors.secondary} size={15}>From</Typography>
                            <Typography size={10} variant="medium" >City</Typography>
                        </View>
                        <TextInput style={styles.input}
                            placeholder="Karachi"
                            value={filters.cityFrom.value}
                            onChangeText={filterStateChangeHandler.bind(this, 'cityFrom')}
                        />
                    </View>
                    <View style={[styles.row, { justifyContent: 'space-between', width: '80%', marginTop: responsiveHeight(1) }]}>
                        <View>
                            <Typography color={colors.secondary} size={15}>To</Typography>
                            <Typography size={10} variant="medium" >City</Typography>
                        </View>
                        <TextInput style={styles.input}
                            placeholder="Lahore"
                            onChangeText={filterStateChangeHandler.bind(this, 'cityTo')}
                            value={filters.cityTo.value}
                        />
                    </View>
                </View>
            </View>
            {
                type !== 'ride' ? null :
                    <>
                        <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: responsiveWidth(6), marginBottom: responsiveHeight(2) }]}>
                            <View>
                                <Typography size={10}>From</Typography>
                                <Typography size={15} variant="medium" color={colors.secondary}>Date</Typography>
                            </View>
                            <TouchableOpacity activeOpacity={0.7} style={styles.dateButton} onPress={showDatepicker}>
                                <Typography variant="small" align="center">{filters.fromDate.value ? filters.fromDate.value : 'DD/MM'}</Typography>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: responsiveWidth(6), marginBottom: responsiveHeight(2) }]}>
                            <View>
                                <Typography size={10}>To</Typography>
                                <Typography size={15} variant="medium" color={colors.secondary}>Date</Typography>
                            </View>
                            <TouchableOpacity activeOpacity={0.7} style={styles.dateButton} onPress={showDateToPicker}>
                                <Typography variant="small" align="center">{filters.toDate.value ? filters.toDate.value : 'DD/MM'}</Typography>
                            </TouchableOpacity>
                        </View>
                    </>
            }

            <Button opacity={0.5} style={styles.button} title="Apply"
                onPress={applyFilterHandler.bind(this, filters)} />

            <ModalDatePicker
                isVisible={show}
                value={filters.fromDate}
                mode="date"
                is24Hour={true}
                minimumDate={new Date()}
                display="spinner"
                onConfirm={onChange}
                onCancel={setShow.bind(this, false)}
            />

            <ModalDatePicker
                isVisible={showTo}
                value={filters.toDate}
                mode="date"
                is24Hour={true}
                minimumDate={new Date()}
                display="spinner"
                onConfirm={onChangeTo}
                onCancel={setShowTo.bind(this, false)}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        // alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: colors.white,
        marginHorizontal: responsiveWidth(5),
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
    },

    header: {
        backgroundColor: colors.primary,
        // marginTop: 10,
        paddingVertical: 10,
    },
    box: {
        alignItems: 'center',
        flex: 1,
        margin: 1,
        paddingVertical: responsiveHeight(1),
    },
    input: {
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 0,
        backgroundColor: colors.white,
        color: colors.textPrimary,
        width: responsiveWidth(35),
        textAlign: 'center',
    },
    dateButton: {
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 0,
        backgroundColor: colors.white,
        width: responsiveWidth(25),
        textAlign: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '45%',
        height: height * 0.055,
        marginTop: responsiveHeight(4),
        marginBottom: responsiveHeight(2),
        alignSelf: 'center',
        backgroundColor: colors.secondary,
    },
});

export default BookRideFilter;
