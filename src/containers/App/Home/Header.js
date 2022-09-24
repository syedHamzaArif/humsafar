import images from '#assets/';
import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import globalStyles from '#res/global.styles';
import { hitSlop } from '#util/';
import { responsiveFontSize, responsiveWidth } from '#util/responsiveSizes';
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './home.styles';

const Header = ({ unread, notificationIconPressHandler, name, navigation }) => {
    return (
        <View style={styles.row}>
            <View style={[styles.rowFirst, { paddingTop: useSafeAreaInsets().top }]}>
                <View style={globalStyles.row} >
                    <Icon
                        name="menu" type="feather"
                        size={24} containerStyle={{ marginRight: responsiveWidth(3) }}
                        onPress={navigation.openDrawer}
                    />
                    <Typography new variant="bold" size={responsiveFontSize(3)} lineHeight={responsiveFontSize(6)} >
                        Home
                    </Typography>
                </View>
                <Typography new variant="bold" color={colors.newSecondary}>{`Good afternoon\n${name}`}</Typography>
                <Typography new color={colors.textSecondary} variant="small">
                    Thinking of travel? 25 others are also travelling in your area
                </Typography>
                <View style={styles.iconContainer}>
                    {
                        unread !== 0 ?
                            <TouchableOpacity activeOpacity={1}
                                onPress={notificationIconPressHandler}
                                style={styles.badge}>
                                <Typography new size={unread > 9 ? 10 : 12}
                                    color={colors.white} variant="bold">{unread < 10 ? unread : '9\u207a'}</Typography>
                            </TouchableOpacity>
                            : null
                    }
                    <Icon name="notifications" type="ionicon" size={responsiveFontSize(3.5)}
                        underlayColor="transparent" color={colors.newSecondary}
                        hitSlop={hitSlop} onPress={notificationIconPressHandler}
                        containerStyle={{ padding: 8 }}
                    />
                </View>

            </View>
            <View style={styles.headerImage} >
                <Image resizeMode="cover" source={images.home_car} style={globalStyles.image} />
            </View>
        </View>

    );
};

export default Header;
