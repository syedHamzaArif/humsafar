import { colors } from '#res/colors';
import { getFonts } from '#util/';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveHeight(2),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    details: {
        borderWidth: 0.3,
        borderColor: colors.buttonGray,
        borderRadius: 8,
        paddingHorizontal: responsiveWidth(2),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: responsiveHeight(2),
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: responsiveWidth(3),
    },
    detailTitle: {
        marginLeft: responsiveWidth(1.5),
    },
    passengerStyling: {
        width: '24%',
        borderRadius: 6,
        overflow: 'hidden',
        marginVertical: responsiveHeight(1),
    },
    passengerPreference: {
        backgroundColor: colors.newSecondary,
    },
    insideImage: {
        alignItems: 'center',
    },
    passengerWithYou: {
        justifyContent: 'space-between',
        marginTop: responsiveHeight(2),
    },
    toggle: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.6 }],
    },
    input: {
        backgroundColor: colors.newPrimary,
        padding: 0,
        marginLeft: 10,
        borderRadius: 6,
        paddingHorizontal: 5,
        color: colors.newSecondary,
        fontFamily: getFonts().semiBold,
        width: responsiveWidth(10),
        borderBottomWidth: 0.4,
        textAlign: 'center',
        height: 30,
    },
    bottomInput: {
        backgroundColor: colors.newPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        height: 30,
        fontFamily: getFonts().semiBold,
        textAlign: 'center',
        borderBottomWidth: 0.4,
        color: colors.newSecondary,
    },
    carTypeInput: {
        marginVertical: responsiveHeight(1),
        color: colors.newPrimary,
        height: 40,
        width: responsiveWidth(24),
        borderRadius: 12,
    },
    perSeat: {
        backgroundColor: colors.newSecondary,
    },
    fullCar: {
        backgroundColor: colors.newAccent,
    },
    specialNotesView: {
        marginVertical: responsiveHeight(1),
    },
    inputSpecial: {
        overflow: 'hidden',
        flex: 2,
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: colors.textPrimary,
        height: responsiveHeight(7),
        color: colors.textPrimary,
        padding: 8,
    },
    specialNoteHeading: {
        flex: 1,
    },
});

export default styles;
