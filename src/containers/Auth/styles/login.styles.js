import { colors } from '#res/colors';
import { getFonts } from '#util/';
import { height } from '#util/';
import { width } from '#util/';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flex: 1,
        flexDirection: 'row',
    },
    main: {
        flex: 1,
        width: '100%',
        padding: responsiveWidth(4),
    },
    heading: {
        marginLeft: responsiveWidth(3),
    },
    input: {
        height: 45,
        width: '80%',
        color: colors.newPrimary,
        fontFamily: getFonts().semiBold,
    },
    inputRow: {
        flexDirection: 'row',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 45,
        backgroundColor: colors.newSecondary,
        marginTop: responsiveHeight(2),
    },
    error: {
        fontSize: 12,
        textAlign: 'center',
        color: colors.warning,
        marginVertical: responsiveHeight(1),
    },
    forgetPassword: {
        alignSelf: 'flex-end',
        marginRight: responsiveWidth(8),
        marginVertical: responsiveHeight(2),
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerButton: {
        width: responsiveWidth(40),
        height: responsiveWidth(20),
    },
    loader: {
        position: 'absolute',
        right: responsiveWidth(20) - (25 / 2),
        top: responsiveWidth(10) - (25 / 2),
        zIndex: 10,
    },
});

export default styles;
