import EmptyComponent from '#components/common/EmptyComponent';
import Modal from '#components/common/Modal';
import Typography from '#components/common/Typography';
import { Service } from '#config/service';
import BookRideFilter from '#containers/App/BookRide/SearchFilter/BookRideFilter';
import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import ModalDatePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { getTime } from '#util/index';
import { showPopUpMessage } from '#util/';
import LoaderView from '#components/common/LoaderView';
import { useSelector } from 'react-redux';
import BookTransportModal from './BookTransportModal';
import BookRideComponent from '#components/BookRide';

const bookTransportActionItems = (navigation, itemPressHandler) => ([
    {
        id: 0, title: 'Details',
        action: item => navigation.navigate('Ride Details', { item: item, itemPressHandler: itemPressHandler.bind(this, item) }),
    },
]);

const BookTransporter = ({ navigation }) => {
    const { setOptions, navigate } = navigation;
    const [filterVisible, setFilterVisible] = useState(false);
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [currentRide, setCurrentRide] = useState('');
    const [filterState, setFilterState] = useState({
        toDate: { name: 'To Date', value: null },
        fromDate: { name: 'From Date', value: null },
        isAc: { name: 'Air Condition', value: false },
        isLuggage: { name: 'Luggage', value: false },
        isSmoking: { name: 'Smoking', value: false },
        cityFrom: { name: 'From', value: null },
        cityTo: { name: 'To', value: null },
    });
    const [refreshing, setRefreshing] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [bookingType, setBookingType] = useState('custom-seats');
    const [modalLoading, setModalLoading] = useState(false);
    const [modalResponseType, setModalResponseType] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [seatingOrder, setSeatingOrder] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const { userData: { id: userId } } = useSelector(state => state.userReducer);


    const getTransports = async (_filters, _refreshing) => {
        !_refreshing && setLoading(true);
        try {
            !_refreshing && setLoading(true);
            const updatedFilters = _filters ?? filterState;

            var finalFilterData = {};

            for (const key in updatedFilters) {
                const { value } = updatedFilters[key];
                if (value) finalFilterData = { ...finalFilterData, [key]: value };
            }

            const { data } = await Service.getTransports(finalFilterData);
            setRides(data);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            !_refreshing && setLoading(false);
        }

    };

    useEffect(() => {
        getTransports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await getTransports(null, true);
        setRefreshing(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useLayoutEffect(() => {
        setOptions({
            headerRight: () => <Icon name="filter" hitSlop={{ top: 20, right: 20, left: 20, bottom: 20 }}
                type="font-awesome-5" color={colors.primary}
                size={20} underlayColor="transparent"
                onPress={setFilterVisible.bind(this, true)}
            />,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const applyFilterHandler = (_filters) => {
        setFilterVisible(false);
        setFilterState(_filters);
        getTransports(_filters);
    };

    const removeFilterHandler = _filter => {
        const updatedFilters = { ...filterState };
        updatedFilters[_filter].value = null;
        setFilterState(updatedFilters);
        getTransports(updatedFilters);
    };


    const bookRideHandler = async () => {
        try {
            setModalLoading(true);
            const updatedSeatingOrder = seatingOrder.filter(item => item !== 'driver');

            const body = {
                transporter_id: currentRide.transporter_id, date, time,
                booking_type: bookingType,
                seat_order: JSON.stringify(updatedSeatingOrder),
            };
            const { status } = await Service.requestTransportRide(body);
            if (status) {
                setRides(_rides => {
                    const updatedRides = _rides;
                    const currentIndex = _rides.findIndex(_ride => +_ride.transporter_id === +currentRide.transporter_id);
                    if (currentIndex !== -1) {
                        updatedRides[currentIndex].requestStatus = 'Active';
                    }
                    return updatedRides;
                });
                setModalResponseType('success');
                setModalMessage('');
            } else {
                showPopUpMessage('Failed', 'Something went wrong', 'danger');
            }
        } catch (error) {
            console.trace('Inside Catch => ', error);
            setModalResponseType('failure');
            setModalMessage(typeof error === 'string' ? error : 'Something went wrong');
        } finally {
            setModalLoading(false);
            setBookingType('custom-seats');
        }
    };


    const itemPressHandler = async _ride => {
        setConfirmModalVisible(true);
        setModalLoading(true);
        try {
            setCurrentRide(_ride);

            var updatedSeatingOrderList = [];

            for (let index = 0; index <= _ride.model_seating_capacity; index++) {
                if (index === 1) {
                    updatedSeatingOrderList[index] = 'driver';
                } else {
                    updatedSeatingOrderList[index] = 'empty';
                }
            }
            setSeatingOrder(updatedSeatingOrderList);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            setModalLoading(false);
        }
    };

    const setSeatingOrderHandler = _index => {
        var updatedSelectedSeats = [...selectedSeats];
        const alreadyExistsIndex = updatedSelectedSeats.findIndex(item => item === _index);
        if (alreadyExistsIndex === -1) {
            updatedSelectedSeats.push(_index);
        } else {
            updatedSelectedSeats = updatedSelectedSeats.filter(item => item !== _index);
        }
        setSelectedSeats(updatedSelectedSeats);
        seatingOrderChangeHandler(updatedSelectedSeats);
    };

    const setConfirmModalVisibleHandler = () => {
        setConfirmModalVisible(false);
        setSelectedSeats([]);
        seatingOrderChangeHandler();
    };

    const seatingOrderChangeHandler = _selectedSeats => {
        var updatedSeatingOrderList = [];

        for (let index = 0; index <= currentRide.model_seating_capacity; index++) {
            if (index === 1) {
                updatedSeatingOrderList[index] = 'driver';
            } else {
                updatedSeatingOrderList[index] = 'empty';
            }
        }

        if (updatedSeatingOrderList && _selectedSeats?.length) {
            for (const index in _selectedSeats) {
                const element = _selectedSeats[index];
                updatedSeatingOrderList[element] = 'passenger';
            }
        }
        setSeatingOrder(updatedSeatingOrderList);
    };

    //Date
    const onChange = (selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        // setDate(currentDate);
        setDate(moment(currentDate).format('MM-DD-YYYY'));
        // stateChange('date', currentDate);
    };
    const showMode = () => {
        setShow(true);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    //Time
    const onChangeTime = (selectedDate) => {
        const currentDate = selectedDate || date;
        setShowTime(false);
        // setTime(currentDate);
        setTime(getTime(currentDate));

    };
    const showModeTime = () => {
        setShowTime(true);
    };

    const showTimePicker = () => {
        showModeTime('time');
    };

    const bookingTypeCheckHandler = (value, _bool) => {
        if (value === 'full-ride' && !_bool) return setBookingType('custom-seats');
        setBookingType(value);
    };


    const actionItems = bookTransportActionItems(navigation, itemPressHandler);

    const _renderItem = (props) => <BookRideComponent key={`${props.index}rideItem`}
        itemPressHandler={itemPressHandler}
        userId={userId} navigate={navigate} {...props}
        actionItems={actionItems}
    />;

    return (
        <View style={styles.root} >
            {loading && <LoaderView />}
            <View style={styles.filterView} >
                {
                    Object.entries(filterState).map(([key, value], index) => {
                        if (!value.value) return;
                        return (
                            <TouchableOpacity
                                onPress={removeFilterHandler.bind(this, key)}
                                key={`filter${index}`} style={styles.filterButton} activeOpacity={0.9}>
                                <Typography variant="semiBold" size={12} color={colors.white}>{value.name}{value.value !== true && ': '}</Typography>
                                <Typography variant="semiBold" size={12} color={colors.white}>{value.value}</Typography>
                                <Icon type="entypo" name="circle-with-cross"
                                    size={14} color={colors.white}
                                    containerStyle={{ marginLeft: 5 }}
                                />
                            </TouchableOpacity>
                        );
                    })
                }
            </View>
            <FlatList
                data={rides}
                showsVerticalScrollIndicator={false}
                renderItem={_renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<EmptyComponent title="No transports found" />}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
                onRefresh={onRefresh}
                refreshing={refreshing}
            />
            <Modal
                setVisible={setFilterVisible}
                visible={filterVisible}
            >
                <BookRideFilter
                    type="transport"
                    closeModal={setFilterVisible.bind(this, false)}
                    applyFilterHandler={applyFilterHandler}
                    state={filterState}
                />
            </Modal>
            <Modal
                setVisible={setConfirmModalVisibleHandler}
                visible={confirmModalVisible}
            >
                <BookTransportModal
                    currentRide={currentRide}
                    showDatepicker={showDatepicker}
                    showTimePicker={showTimePicker}
                    date={date} time={time}
                    setVisible={setConfirmModalVisibleHandler}
                    bookRideHandler={bookRideHandler}
                    loading={modalLoading}
                    modalResponseType={modalResponseType}
                    setModalResponseType={setModalResponseType}
                    modalMessage={modalMessage}
                    bookingType={bookingType}
                    bookingTypeCheckHandler={bookingTypeCheckHandler}
                    seatingOrder={seatingOrder}
                    setSeatingOrder={setSeatingOrderHandler}
                    selectedSeats={selectedSeats}
                />
                <ModalDatePicker
                    isVisible={show}
                    value={date}
                    mode="date"
                    is24Hour={true}
                    minimumDate={new Date()}
                    display="spinner"
                    onConfirm={onChange}
                    onCancel={setShow.bind(this, false)}
                />
                <ModalDatePicker
                    isVisible={showTime}
                    value={time}
                    mode="time"
                    is24Hour={true}
                    minimumDate={new Date()}
                    display="spinner"
                    onConfirm={onChangeTime}
                    onCancel={setShowTime.bind(this, false)}
                />
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.backgroundWhite,
        paddingHorizontal: responsiveWidth(5),
    },
    searchBar: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: colors.white,
        elevation: 5,
        borderRadius: 8,
        marginVertical: responsiveHeight(2),
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemList: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: colors.white,
        elevation: 5,
        borderRadius: 4,
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(3),
        marginVertical: responsiveHeight(1),
        marginHorizontal: responsiveWidth(1),
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: responsiveHeight(0.8),
        paddingHorizontal: responsiveWidth(1),
        marginHorizontal: responsiveWidth(0.5),
        width: responsiveWidth(18),
        alignItems: 'center',
    },
    filterView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 20,
        paddingVertical: responsiveWidth(1),
        paddingHorizontal: responsiveWidth(2),
        marginHorizontal: responsiveWidth(1),
        marginVertical: responsiveHeight(1),
    },

    modalView: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 10,
        paddingVertical: 10,
    },
    dateTimeStyle: {
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
        width: '48%',
        paddingVertical: responsiveHeight(1),
    },
});

export default BookTransporter;
