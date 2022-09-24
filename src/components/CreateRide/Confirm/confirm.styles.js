import { colors } from '#res/colors';
import { getFonts } from '#util/';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(5),
    },
    personalDetailStyle: {
        marginVertical: responsiveHeight(1),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemContainer: {
        padding: responsiveWidth(3),
        backgroundColor: colors.newSecondary,
        borderRadius: 8,
    },
    rowItem: {
        flex: 1,
        justifyContent: 'space-evenly',
    },
    vehicleDetailContainer: {
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    vehicleDetailHeading: {
        marginVertical: responsiveHeight(1),
    },
    vehicleDetailIcon: {
        marginRight: responsiveWidth(5),
    },
    vehicleDetailItem: {
        width: responsiveWidth(35),
        borderBottomWidth: 0.4,
        paddingVertical: responsiveHeight(1),
        marginHorizontal: responsiveWidth(2),
        borderBottomColor: colors.newPrimary,
    },
    fromToStyling: {
        borderWidth: 0.6,
        backgroundColor: colors.white,
        borderRadius: 14,
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(2),
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
    },
    input: {
        backgroundColor: colors.white,
        padding: 0,
        marginLeft: 10,
        borderRadius: 6,
        paddingHorizontal: 5,
        color: colors.textPrimary,
        fontFamily: getFonts().semiBold,
        width: responsiveWidth(20),
        textAlign: 'center',
    },
    toggle: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.6 }],
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
        borderBottomWidth: 0.5,
        borderBottomColor: colors.textPrimary,
        height: responsiveHeight(7),
        color: colors.textPrimary,
        padding: 8,
    },
    seatingOrderContainer: {
        backgroundColor: colors.newPrimary,
        borderRadius: 12,
        borderColor: colors.newSecondary,
        borderWidth: 0.6,
    },
    button: {
        borderRadius: 12,
        alignItems: 'center',
        width: '40%',
        paddingVertical: responsiveHeight(1.5),
        marginTop: responsiveHeight(3),
    },
    modalStyle: {
        backgroundColor: colors.white,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingTop: responsiveHeight(3),
        alignItems: 'center',
    },
    modalButton: {
        width: '50%',
        // borderWidth: 0.25,
        borderColor: colors.textBody,
        paddingVertical: responsiveHeight(2),
        marginTop: responsiveHeight(2),
    },
    seatingOrderView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        marginTop: responsiveHeight(1),
    },
    item: {
        borderRadius: 12,
        minWidth: responsiveWidth(34),
        margin: responsiveWidth(1),
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        padding: responsiveWidth(3),
    },
});

export default styles;
