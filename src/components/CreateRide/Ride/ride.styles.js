import { colors } from '#res/colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    heading: {
        marginVertical: responsiveHeight(0.5),
        padding: 5,
        borderRadius: 3,
    },
    body: {
        flex: 1,
        paddingHorizontal: responsiveHeight(3),
        paddingTop: responsiveHeight(5),
    },
    dateTimeView: {
        backgroundColor: colors.newSecondary,
        borderRadius: 12,
        paddingVertical: 4,
    },
    fromToIcons: {
        width: responsiveFontSize(2.5),
        height: responsiveFontSize(2.5),
    },
    divider: {
        width: 0.5,
        height: '100%',
        backgroundColor: colors.newPrimary,
    },
    dateTimeStyle: {
        padding: 2,
        borderRadius: 4,
        width: '48%',
        paddingVertical: responsiveHeight(1),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fromToStyling: {
        backgroundColor: colors.white,
        borderWidth: 0.6,
        borderRadius: 12,
        paddingVertical: responsiveHeight(2),
        marginVertical: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(2),
        flexDirection: 'row',
    },

});

export default styles;
