import { colors } from '#res/colors';
import { responsiveSize } from '#util/';
import { width } from '#util/';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        // justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: responsiveSize(3),
        backgroundColor: colors.newPrimary,
    },
    main: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        paddingHorizontal: 12,
        borderWidth: 1,
        backgroundColor: colors.newSecondary,
        borderRadius: 12,
        marginVertical: 8,
        borderColor: '#eee',
        padding: 3,
        width: width * 0.9,
    },
    inputStyle: {
        fontSize: 14,
        textAlign: 'center',
        color: colors.white,
    },
    error: {
        fontSize: 14,
        textAlign: 'center',
        color: colors.warning,
        paddingVertical: responsiveHeight(2),
    },
    iconStyle: {
        color: colors.white,
        marginRight: 10,
    },
    inputContainerStyle: {
        width: '100%',
        borderBottomWidth: 0,
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
