import images from '#assets/';
import BookRide from '#components/BookRide';
import EmptyComponent from '#components/common/EmptyComponent';
import Loader from '#components/common/Loader';
import Typography from '#components/common/Typography';
import { Service } from '#config/service';
import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Config from 'react-native-config';

const _keyExtractor = (item, index) => `myRide${index}`;

const myRideActionItems = (navigation) => ([
    {
        id: 0, title: 'Passengers',
        action: (item) => navigation.navigate('Passenger Details', { ride: item }),
    },
    {
        id: 1, title: 'Details',
        action: (item) => navigation.navigate('Ride Details', { item }),
    },
]);

const MyRide = ({ navigation }) => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const actionItems = myRideActionItems(navigation);

    useEffect(() => {
        init();
    }, []);

    const init = async (_filters, _refreshing) => {
        !_refreshing && setLoading(true);
        try {
            const { data } = await Service.getMyRides();
            setRides(data);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            !_refreshing && setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await init(null, true);
        setRefreshing(false);
    }, []);



    const renderList = ({ item, index }) => {
        return (
            <View style={[styles.itemList, { borderLeftWidth: 4, borderColor: colors.primary }]}>
                <View style={{ alignItems: 'flex-start' }}>
                    <Typography size={12}
                        style={{
                            backgroundColor: item.status === 'Active' ? colors.warning :
                                item.status === 'Progress' ? colors.primaryOrange :
                                    item.status === 'Completed' ? colors.secondaryGreen : colors.primary,
                            borderRadius: 8,
                            padding: 2, paddingHorizontal: responsiveWidth(1),
                        }} color={colors.white}
                        variant="small"
                    >
                        {item.status}
                    </Typography>
                </View>
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <View style={styles.row}>
                        <View>
                            <Typography size={10} variant="small">Date</Typography>
                            <View style={[styles.itemList, { paddingVertical: 2, marginVertical: 0, marginHorizontal: 0 }]}>
                                <Typography size={10} variant="small">{moment(item.ride_date).format('DD-MM-YYYY')}</Typography>
                            </View>
                        </View>
                        <View>
                            <Typography style={{ marginHorizontal: responsiveWidth(3) }} size={10} variant="small">Time</Typography>
                            <View style={[styles.itemList, { paddingVertical: 2, marginVertical: 0, marginHorizontal: responsiveWidth(3) }]}>
                                <Typography size={10} variant="small">{item.ride_time}</Typography>
                            </View>
                        </View>
                    </View>
                    <Image source={item.image ? { uri: Config.SERVER + item.image } : images.SUV}
                        style={{ width: 90, height: 65, marginLeft: responsiveWidth(5), marginRight: 4 }}
                        resizeMode="contain" />
                </View>
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <View style={styles.row}>
                        <Image source={images.starting} style={{ width: 15, height: 15 }} resizeMode="contain" />
                        <Typography variant="small" style={{ paddingHorizontal: responsiveWidth(2) }} color={colors.secondary}>{item.from_city}</Typography>
                        <Image source={images.ending} style={{ width: 15, height: 15 }} resizeMode="contain" />
                        <Typography variant="small" style={{ paddingHorizontal: responsiveWidth(2) }} color={colors.secondary}>{item.to_city}</Typography>
                    </View>
                    {/* <Typography style={{ marginHorizontal: responsiveWidth(5) }} color={colors.secondary} variant="semiBold">{item.model}</Typography> */}
                </View>
                <View style={[styles.row, { justifyContent: 'space-between', marginVertical: responsiveHeight(1), marginTop: responsiveHeight(2.5) }]}>
                    <View style={styles.row}>
                        <Image source={images.chair} style={{ width: 17, height: 17, tintColor: colors.textPrimary, marginHorizontal: 2 }} resizeMode="contain" />
                        <View style={[styles.itemList, { paddingVertical: 2, marginVertical: 0, marginHorizontal: 0 }]}>
                            <Typography size={10} variant="small">{item.seating_capacity}</Typography>
                        </View>
                        <Image source={images.pricingIcon} style={{ width: 17, height: 17, marginHorizontal: 2 }} resizeMode="contain" />
                        <View style={[styles.itemList, { paddingVertical: 2, marginVertical: 0, marginHorizontal: 2 }]}>
                            <Typography size={10} variant="small">{item.price_per_seat}</Typography>
                        </View>
                    </View>
                    <View style={[styles.row]}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: colors.warning }]}
                            onPress={() => navigation.navigate('Passenger Details', { ride: item })}>
                            <Typography size={10} variant="small" color={colors.white}>Passengers</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button]} onPress={() => navigation.navigate('Ride Details', { item })}>
                            <Typography size={10} variant="small" color={colors.white}>Details</Typography>
                        </TouchableOpacity>
                    </View>

                </View>
                <Typography style={{ alignSelf: 'flex-end', color: colors.inactiveGray, fontSize: 8, marginRight: 6 }}>{moment(item.created_at).format('DD-MM-YYYY')}</Typography>
            </View>
        );
    };

    const _renderItem = (props) =>
        <BookRide key={`${props.index}rideItem`}
            actionItems={actionItems}
            {...props} />;

    return (
        <View style={styles.root} >
            {
                loading ? <Loader /> :
                    <FlatList
                        data={rides}
                        showsVerticalScrollIndicator={false}
                        renderItem={_renderItem}
                        keyExtractor={_keyExtractor}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ flexGrow: 1 }}
                        ListEmptyComponent={<EmptyComponent title="No Ride Found" />}
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                    />
            }
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
        width: responsiveWidth(22),
        alignItems: 'center',
    },
});

export default MyRide;
