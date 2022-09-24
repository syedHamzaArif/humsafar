import images from '#assets/index';
import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import globalStyles from '#res/global.styles';
import { getAge } from '#util/';
import { responsiveFontSize, responsiveHeight } from '#util/responsiveSizes';
import moment from 'moment';
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Config from 'react-native-config';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import styles from './styles/bookRide.styles';

const BookRide = ({ item, itemPressHandler = () => null, userId, actionItems }) => {
    return (
        <View style={styles.itemList}>
            {
                item.ride_date &&
                <View style={[styles.row, styles.dateTimeView]}>
                    <View style={styles.dateTimeStyle}>
                        <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: 8 }]}>
                            <Icon name="calendar" type="feather" size={responsiveFontSize(2.4)}
                                color={colors.newSecondary} />
                            <Typography new flex align="center"
                                variant="semiBold">
                                {moment(item.ride_date).format('DD-MM-YYYY')}
                            </Typography>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.dateTimeStyle}>
                        <View style={[styles.row, { justifyContent: 'space-between', marginHorizontal: 8 }]}>
                            <Icon name="clock" type="feather" size={responsiveFontSize(2.4)}
                                color={colors.newSecondary} />
                            <Typography new flex align="center"
                                variant="semiBold">
                                {item.ride_time.substring(0, 5)}
                            </Typography>
                        </View>
                    </View>
                </View>
            }

            {
                item.name &&
                <View style={styles.userDetail}>
                    <Typography>
                        <Typography new size={12} >{item.name}</Typography>
                        <Typography new size={12} > - </Typography>
                        <Typography new size={12} >{getAge(item.dateOfBirth)}</Typography>
                        <Typography new size={12} > - </Typography>
                        <Typography new size={12} >{item.profession}</Typography>
                    </Typography>
                </View>
            }
            <View style={{ flex: 1, flexDirection: 'row', marginTop: item.name ? 0 : responsiveHeight(1.5) }} >
                {
                    item.image &&
                    <View style={styles.carImageContainer} >
                        <FastImage source={{ uri: Config.SERVER + item.image }}
                            style={globalStyles.image}
                            resizeMode="contain" />
                    </View>
                }

                <View style={styles.fromToIconsView} >
                    <Image source={images.ic_from} resizeMode="contain" style={styles.fromToIcons} />
                    <Image source={images.ic_to} resizeMode="contain" style={styles.fromToIcons} />
                </View>

                <View style={styles.fromToView} >
                    <View style={styles.fromToView} >
                        <Typography flex size={12} color={colors.primary}>From</Typography>
                        <Typography flex numberOfLines={1} color={colors.textPrimary}>{item.from_city}</Typography>
                    </View>
                    <Image resizeMode="contain" source={images.verticalLine} style={{ width: '100%', height: 10 }} />
                    <View style={styles.fromToView} >
                        <Typography flex size={12} color={colors.primary}>To</Typography>
                        <Typography flex numberOfLines={1} color={colors.textPrimary}>{item.to_city}</Typography>
                    </View>
                </View>
                <View style={styles.rideDetailsView} >
                    <View style={styles.rideDetailsTop}>
                        {
                            item.seating_capacity &&
                            <View style={styles.seatContainer} >
                                <Image source={images.seat} style={styles.fromToIcons} resizeMode="contain" />
                                <Typography style={styles.seatContainerText} size={10}
                                    variant="small">{item.seating_capacity}</Typography>
                            </View>
                        }
                        <View style={styles.seatContainer} >
                            <Image source={images.fare} style={styles.fromToIcons} resizeMode="contain" />
                            <Typography style={styles.seatContainerText} size={10}
                                variant="small">{item.price_per_seat}</Typography>
                        </View>
                    </View>
                </View>
            </View>
            <View style={[styles.row, styles.buttonView]}>
                {
                    !userId || (+item.user_id === +userId || item.status !== 'Active') ? null :
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
                {
                    actionItems.map(action => {
                        let Component = action.render;
                        if (Component) return <Component key={`actionItem${action.id}`} item={item} />;
                        else return (
                            <TouchableOpacity key={`actionItem${action.id}`} style={[styles.button, action.style]}
                                onPress={action.action.bind(this, item)}>
                                <Typography size={10} variant="small" new >{action.title}</Typography>
                            </TouchableOpacity>
                        );
                    })
                }
            </View>

            <Typography style={styles.createdDate}>{moment(item.created_at).format('DD-MM-YYYY')}</Typography>
        </View>
    );
};

export default React.memo(BookRide);
