import { colors } from '#res/colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
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
    inputView: {
        backgroundColor: colors.newSecondary,
        padding: 3,
        borderRadius: 12,
        marginTop: responsiveHeight(2),
    },
    cell: {
        height: responsiveHeight(4.5),
        lineHeight: 38,
        fontSize: responsiveFontSize(3),
        textAlign: 'center',
        overflow: 'hidden',
        color: colors.white,
        flex: 1,
    },
    focusCell: {
        borderColor: '#000',
    },
    error: {
        fontSize: 12,
        textAlign: 'center',
        color: colors.warning,
        marginVertical: responsiveHeight(5),
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerButton: {
        width: responsiveWidth(40),
        height: responsiveWidth(20),
    },
});

export default styles;
