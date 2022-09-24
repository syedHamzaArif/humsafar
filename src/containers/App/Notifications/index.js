import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Typography from '#components/common/Typography';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { colors } from '#res/colors';
import { Service } from '#config/service';
import { useDispatch, useSelector } from 'react-redux';
import { updatenotificationdata } from '#redux/actions/actionCreators';
import { getTimeSince } from '#util/index';
import EmptyComponent from '#components/common/EmptyComponent';

const _keyExtractor = (item, index) => `notification${index}${item.id}`;

const Notifications = ({ navigation, route }) => {

    const { getNotifications } = route?.params;

    const { unread, notifications } = useSelector(state => state.notificationReducer);
    const dispatch = useDispatch();
    const updateNotificationData = data => dispatch(updatenotificationdata(data));
    const [refreshing, setRefreshing] = useState(false);

    // const menuRef = useRef(null);
    // const labels = ['Here', 'Test'];
    // const headerRightPressHandler = () => {
    //     UIManager.showPopupMenu(
    //         findNodeHandle(menuRef.current),
    //         labels,
    //         () => { },
    //         (result, index) => {
    //             // if (onPress) {
    //             //     onPress({ action: 'menu', result, index });
    //             // }
    //         },
    //     );
    // };

    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <View>
    //                 <View
    //                     ref={menuRef}
    //                     style={{
    //                         backgroundColor: 'transparent',
    //                         width: 1,
    //                         height: StyleSheet.hairlineWidth,
    //                     }}
    //                 />
    //                 <Icon containerStyle={{ padding: 6 }} underlayColor="transparent"
    //                     onPress={headerRightPressHandler}
    //                     name="more-vertical" type="feather" size={24} color={colors.primary} />
    //             </View>
    //         ),
    //     });
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [navigation]);


    const pressHandler = async item => {
        const obj = { notification_id: item.notification_id };
        navigation.navigate('NotificationDetails', { data: JSON.parse(item.data), from: 'home' });
        const { status } = await Service.readNotification(obj);
        if (status && unread) {
            const updatedReadCount = { name: 'unread', value: unread - 1 };
            updateNotificationData(updatedReadCount);
            const updatedNotifications = [...notifications];
            const currentIndex = updatedNotifications.findIndex(element => +element.notification_id === +item.notification_id);
            if (currentIndex !== -1) {
                updatedNotifications[currentIndex].read = true;
                updateNotificationData({ name: 'notifications', value: updatedNotifications });
            }
        }
    };

    const refreshHandler = async () => {
        setRefreshing(true);
        getNotifications && await getNotifications();
        setRefreshing(false);
    };

    const _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.8}
                style={{
                    ...styles.item,
                    backgroundColor: item.read ? colors.white : colors.primary,
                }}
                onPress={pressHandler.bind(this, item)} >
                <View style={styles.row}>
                    <View style={{}} >
                        <Typography size={16} color={!item.read ? colors.white : colors.secondary} variant="bold">
                            {item.title}
                        </Typography>
                        <Typography style={{ marginVertical: 6 }} size={14} color={!item.read ? colors.white : colors.textPrimary} variant="small" numberOfLines={4}>
                            {item?.message}
                        </Typography>
                        <Typography size={10} variant="small" color={!item.read ? colors.white : colors.textPrimary} >
                            {getTimeSince(item?.created_at)}
                        </Typography>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={notifications}
            keyExtractor={_keyExtractor}
            renderItem={_renderItem}
            onRefresh={refreshHandler}
            refreshing={refreshing}
            ListEmptyComponent={<EmptyComponent title="No Notifications Found" />}
            contentContainerStyle={styles.root}
        />
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.backgroundWhite,
    },
    item: {
        padding: responsiveHeight(1),
        margin: responsiveHeight(1),
        borderRadius: 12,
        backgroundColor: colors.white,
    },
    imageView: {
        width: responsiveWidth(24),
        height: responsiveWidth(24),
        marginRight: responsiveWidth(2),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: responsiveWidth(2),
    },
});

export default Notifications;
