import images from '#assets/';
import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import moment from 'moment';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { View, StyleSheet } from 'react-native';
import Typography from './Typography';

const TravelCard = ({
    item = {},
    detailPressHandler = () => null,
    itemPressHandler = () => null,
    userId,
}) => {
    return (
        <View style={[
            styles.itemList,
            { borderLeftWidth: 4, borderColor: colors.primary },
        ]}>
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
                {
                    item.ride_date ?
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
                                    <Typography size={10} variant="small">{item.ride_time?.substring(0, 5)}</Typography>
                                </View>
                            </View>
                        </View> : <View />
                }
                <Image source={images.SUV}
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
                    {
                        +item.user_id === +userId ? null :
                            <TouchableOpacity
                                onPress={itemPressHandler.bind(this, item)}
                                disabled={item.requestStatus}
                                style={
                                    [
                                        styles.button,
                                        { backgroundColor: item.requestStatus ? colors.white : colors.secondary },
                                        item.requestStatus ? { borderWidth: 1, borderColor: colors.secondary } : {},
                                    ]
                                }
                            >
                                <Typography size={10} variant="small" color={item.requestStatus ? colors.secondary : colors.white}>
                                    {item.requestStatus === 'Active' ? 'Requested' : item.requestStatus ?? 'Book Ride'}
                                </Typography>
                            </TouchableOpacity>
                    }
                    <TouchableOpacity style={[styles.button]} onPress={detailPressHandler}>
                        <Typography size={10} variant="small" color={colors.white}>Details</Typography>
                    </TouchableOpacity>
                </View>

            </View>
            <Typography style={{ alignSelf: 'flex-end', color: colors.inactiveGray, fontSize: 8, marginRight: 6 }}>{moment(item.created_at).format('DD-MM-YYYY')}</Typography>
        </View>
    );
};

const styles = StyleSheet.create({
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
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

export default TravelCard;
