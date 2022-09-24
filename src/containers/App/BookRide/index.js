import EmptyComponent from '#components/common/EmptyComponent';
import LoaderView from '#components/common/LoaderView';
import Modal from '#components/common/Modal';
import Typography from '#components/common/Typography';
import { Service } from '#config/service';
import { colors } from '#res/colors';
import { showPopUpMessage } from '#util/';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useSelector } from 'react-redux';
import BookModal from './BookModal/BookModal';
import BookRideComponent from '#components/BookRide';
import BookRideFilter from './SearchFilter/BookRideFilter';
import styles from '#components/styles/bookRide.styles';

const _keyExtractor = (item, index) => index.toString();

const bookRideActionItems = (navigation, itemPressHandler) => ([
    {
        id: 0, title: 'Details',
        action: item => navigation.navigate('Ride Details', { item: item, itemPressHandler: itemPressHandler.bind(this, item) }),
    },
]);


const BookRide = ({ navigation }) => {
    const { setOptions, navigate } = navigation;
    const [filterVisible, setFilterVisible] = useState(false);
    const [rides, setRides] = useState([]);
    const [currentRide, setCurrentRide] = useState({});
    const [loading, setLoading] = useState(false);
    const [filterState, setFilterState] = useState({
        toDate: { name: 'To Date', value: null },
        fromDate: { name: 'From Date', value: null },
        isAc: { name: 'Air Condition', value: false },
        isLuggage: { name: 'Luggage', value: false },
        isSmoking: { name: 'Smoking', value: false },
        cityFrom: { name: 'From', value: null },
        cityTo: { name: 'To', value: null },
    });
    const [bookingType, setBookingType] = useState('custom-seats');
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalResponseType, setModalResponseType] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [selectedSeats, setSelectedSeats] = useState([]);

    // pagination
    const [refreshing, setRefreshing] = useState(false);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true);
    const [endLoader, setEndLoader] = useState(false);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(null);


    const { userData: { id: userId } } = useSelector(state => state.userReducer);

    const getRides = async (_filters, _refreshing, updatedPage) => {
        const pageNumber = updatedPage ? updatedPage : page;
        const pageSize = 10;
        try {
            !_refreshing && setLoading(true);
            const updatedFilters = _filters ?? filterState;

            var finalFilterData = {};
            for (const key in updatedFilters) {
                const { value } = updatedFilters[key];
                if (value) finalFilterData = { ...finalFilterData, [key]: value };
            }
            const { data } = await Service.getRides(finalFilterData, pageNumber, pageSize);
            setRides(data);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            !_refreshing && setLoading(false);
        }
    };

    useEffect(() => {
        getRides();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await getRides(null, true);
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

    const onEndReachHandler = async () => {
        if (totalItems > rides?.length) {
            try {
                if (!onEndReachedCalledDuringMomentum) {
                    setOnEndReachedCalledDuringMomentum(true);
                    setEndLoader(true);
                    const updatedPage = page + 1;
                    setPage(updatedPage);
                    await getRides(null, true, updatedPage);
                    setEndLoader(false);
                }
            } catch (error) {
                console.trace('Inside Catch => ', error);
            } finally {
            }
        }
    };

    const onMomentumScrollBeginHandler = () => {
        setOnEndReachedCalledDuringMomentum(false);
    };


    const bookRideHandler = async () => {
        try {
            setModalLoading(true);
            const body = {
                ride_id: currentRide.ride_id,
                booking_type: bookingType,
                seat_order: JSON.stringify(selectedSeats),
            };
            const { status } = await Service.requestBookRide(body);
            if (status) {
                setRides(_rides => {
                    const updatedRides = _rides;
                    const currentIndex = _rides.findIndex(_ride => +_ride.ride_id === +currentRide.ride_id);
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

    const bookingTypeCheckHandler = (value, _bool) => {
        if (value === 'full-ride' && !_bool) return setBookingType('custom-seats');
        setBookingType(value);
    };

    const applyFilterHandler = (_filters) => {
        setFilterVisible(false);
        setFilterState(_filters);
        getRides(_filters);
    };

    const removeFilterHandler = _filter => {
        const updatedFilters = { ...filterState };
        updatedFilters[_filter].value = null;
        setFilterState(updatedFilters);
        getRides(updatedFilters);
    };


    const itemPressHandler = async _ride => {
        // setConfirmModalVisible(true);
        // setModalLoading(true);
        setLoading(true);
        try {
            const { full_ride, capacity } = await Service.getAvailableSeats(_ride.ride_id);
            const updatedRide = { ..._ride, full_ride, capacity };
            setCurrentRide(updatedRide);
            setConfirmModalVisible(true);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            setLoading(false);
            // setModalLoading(false);
        }
    };
    const actionItems = bookRideActionItems(navigation, itemPressHandler);

    const _renderItem = (props) =>
        <BookRideComponent key={`${props.index}rideItem`}
            itemPressHandler={itemPressHandler}
            userId={userId} navigate={navigate} {...props}
            actionItems={actionItems}
        />;

    const _separatorComponent = () => <View style={styles.separator} />;

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
                                <Typography variant="semiBold" size={12} color={colors.white}>
                                    {value.value}
                                </Typography>
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
                keyExtractor={_keyExtractor}
                keyboardShouldPersistTaps="handled"
                ItemSeparatorComponent={_separatorComponent}
                ListEmptyComponent={<EmptyComponent title="No rides found" />}
                contentContainerStyle={{ flexGrow: 1 }}
                onRefresh={onRefresh}
                refreshing={refreshing}
                onMomentumScrollBegin={onMomentumScrollBeginHandler}
                onEndReached={onEndReachHandler}
                onEndReachedThreshold={0.1}
            />
            <Modal
                setVisible={setFilterVisible}
                visible={filterVisible}
            >
                <BookRideFilter
                    closeModal={setFilterVisible.bind(this, false)}
                    applyFilterHandler={applyFilterHandler}
                    state={filterState}
                />
            </Modal>
            <Modal
                setVisible={setConfirmModalVisible}
                visible={confirmModalVisible}
            >
                <BookModal
                    loading={modalLoading}
                    modalResponseType={modalResponseType}
                    modalMessage={modalMessage}
                    setModalResponseType={setModalResponseType}
                    setVisible={setConfirmModalVisible}
                    bookRideHandler={bookRideHandler}
                    currentRide={currentRide}
                    bookingType={bookingType}
                    bookingTypeCheckHandler={bookingTypeCheckHandler}
                    selectedSeats={selectedSeats}
                    setSelectedSeats={setSelectedSeats}
                />
            </Modal>
        </View>
    );
};

export default BookRide;
