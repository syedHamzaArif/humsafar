import images from '#assets/';
import EmptyComponent from '#components/common/EmptyComponent';
import Typography from '#components/common/Typography';
import { Service } from '#config/service';
import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const MyPassenger = (props) => {
    const [rides, setRides] = useState([]);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            const { data } = await Service.getRides();
            setRides(data);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        }
    };



    const renderList = ({ item, index }) => {
        return (
            <View style={[styles.itemList, { borderLeftWidth: 4, borderColor: colors.primary }]}>
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <View style={styles.row}>
                        <View>
                            <Typography size={10} variant="small">Date</Typography>
                            <View style={[styles.itemList, { paddingVertical: 2, marginVertical: 0, marginHorizontal: 0 }]}>
                                <Typography size={10} variant="small">{item.ride_date.substring(0, 10)}</Typography>
                            </View>
                        </View>
                        <View>
                            <Typography style={{ marginHorizontal: responsiveWidth(3) }} size={10} variant="small">Time</Typography>
                            <View style={[styles.itemList, { paddingVertical: 2, marginVertical: 0, marginHorizontal: responsiveWidth(3) }]}>
                                <Typography size={10} variant="small">{item.ride_time.split(0, 5)}</Typography>
                            </View>
                        </View>
                    </View>
                    <Image source={images.SUV}
                        style={{ width: 90, height: 65, marginHorizontal: responsiveWidth(5) }}
                        resizeMode="contain" />
                </View>
                <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <View style={styles.row}>
                        <Image source={images.starting} style={{ width: 15, height: 15 }} resizeMode="contain" />
                        <Typography variant="small" style={{ paddingHorizontal: responsiveWidth(2) }} color={colors.secondary}>{item.start_address}</Typography>
                        <Image source={images.ending} style={{ width: 15, height: 15 }} resizeMode="contain" />
                        <Typography variant="small" style={{ paddingHorizontal: responsiveWidth(2) }} color={colors.secondary}>{item.end_address}</Typography>
                    </View>
                    <Typography style={{ marginHorizontal: responsiveWidth(5) }} color={colors.secondary} variant="semiBold">{item.model}</Typography>
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
                        <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondary }]}>
                            <Typography size={10} variant="small" color={colors.white}>Book Ride</Typography>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button]}>
                            <Typography size={10} variant="small" color={colors.white}>Details</Typography>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        );
    };


    return (
        <View style={styles.root} >
            <FlatList
                data={rides}
                showsVerticalScrollIndicator={false}
                renderItem={renderList}
                keyExtractor={(item, index) => index.toString()}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
                ListEmptyComponent={<EmptyComponent title="No Passenger Found" />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.white,
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
});

export default MyPassenger;
