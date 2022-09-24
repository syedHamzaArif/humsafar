import React, { useContext } from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getFonts, height, width } from '#util/index';
import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import { getInitials } from '#util/index';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '#context/';
import { Icon } from 'react-native-elements';
import { responsiveHeight } from '#util/responsiveSizes';

const DrawerContent = (props) => {
    const { navigation: { navigate, closeDrawer } } = props;
    const { userData: { name } } = useSelector(state => state.userReducer);

    const initials = name ? getInitials(name) : '';
    const { signOut } = useContext(AuthContext);

    return (
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.primary }} >
            <DrawerContentScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 0, backgroundColor: colors.newPrimary }}>
                <View style={styles.header}>
                    <Icon name="cross" type="entypo" size={24}
                        underlayColor="transparent" color={colors.black}
                        onPress={closeDrawer}
                        containerStyle={styles.crossButton} />
                    {
                        initials ?
                            <TouchableOpacity activeOpacity={0.6} style={styles.avatarView}>
                                <Typography variant="bold" color={colors.white} size={20}>{initials}</Typography>
                            </TouchableOpacity> : <View />
                    }

                    <TouchableOpacity style={styles.accountButton}
                        onPress={() => navigate('My Profile')}
                    >
                        <View>
                            <Typography style={{ paddingLeft: 10 }} size={16} variant="semiBold" >My Profile</Typography>
                        </View>
                        <Icon name="chevron-right" type="entypo" size={24}
                            underlayColor="transparent" color={colors.black}
                        />
                    </TouchableOpacity>
                </View>
                {/* <DrawerItemList  {...props} labelStyle={{ fontSize: 14, fontFamily: getFonts().bold }} /> */}
                <View style={{ flexGrow: 1, marginTop: responsiveHeight(5) }}>
                    <DrawerItem {...props} label="My Rides"
                        labelStyle={{ fontSize: 14, fontFamily: getFonts().regular }}
                        icon={({ size, color }) => <Icon size={size} color={color} name="car" type="antdesign" />}
                        onPress={() => navigate('My Ride')}
                    />
                    <DrawerItem {...props} label="My Bookings"
                        labelStyle={{ fontSize: 14, fontFamily: getFonts().regular }}
                        icon={({ size, color }) => <Icon size={size} color={color} name="ios-checkmark-done" type="ionicon" />}
                        onPress={() => navigate('My Booking')} />
                    <DrawerItem {...props} label="Become Transporter"
                        labelStyle={{ fontSize: 14, fontFamily: getFonts().regular }}
                        icon={({ size, color }) => <Icon size={size} color={color} name="truck-fast-outline" type="material-community" />}
                        onPress={() => navigate('Make Me Transporter')} />
                    <DrawerItem {...props} label="My Transports"
                        labelStyle={{ fontSize: 14, fontFamily: getFonts().regular }}
                        icon={({ size, color }) => <Icon size={size} color={color} name="format-list-text" type="material-community" />}
                        onPress={() => navigate('My Transports')} />
                </View>

                <DrawerItem {...props} label="Log Out"
                    style={{ marginBottom: useSafeAreaInsets().bottom }}
                    labelStyle={{ fontSize: 14, fontFamily: getFonts().regular }}
                    icon={() => <Icon size={16} name="logout" type="simple-line-icon" />}
                    onPress={signOut} />
            </DrawerContentScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
    },
    header: {
        backgroundColor: colors.white,
        height: height * 0.2,
        marginBottom: height * 0.02,
        padding: width * 0.025,
        justifyContent: 'space-between',
        paddingVertical: height * 0.02,
    },
    avatarView: {
        backgroundColor: colors.newSecondary,
        width: 65,
        height: 65,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    modalView: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    crossButton: {
        padding: 12,
        position: 'absolute',
        right: 4,
        top: 4,
    },
    accountButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
});

export default DrawerContent;
