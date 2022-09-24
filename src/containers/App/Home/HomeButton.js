import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import globalStyles from '#res/global.styles';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HomeButton = ({ image, fullWidth, screen, navigation }) => {

    const pressHandler = () => navigation.navigate(screen);

    return (
        <TouchableOpacity onPress={pressHandler} activeOpacity={1}
            style={[styles.root, fullWidth && styles.fullWidth]}>
            <Image source={image} resizeMode="contain" style={styles.image} />
            <Typography new color={colors.newAccent} lineHeight={30} >{screen}</Typography>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    root: {
        minWidth: responsiveWidth(40),
        height: responsiveWidth(35),
        backgroundColor: colors.newSecondary,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: responsiveWidth(2),
        marginVertical: responsiveHeight(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullWidth: {
        minWidth: responsiveWidth(82),
    },
    image: {
        width: responsiveWidth(12),
        height: responsiveWidth(12),
    },
});

export default HomeButton;
