import { colors } from '#res/colors';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: responsiveWidth(5),
    },
    searchBar: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: colors.white,
        elevation: 5,
        borderRadius: 8,
        marginVertical: responsiveHeight(2),
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        backgroundColor: colors.newAccent,
        borderRadius: 12,
        paddingVertical: responsiveHeight(0.8),
        paddingHorizontal: responsiveWidth(1),
        marginHorizontal: responsiveWidth(0.5),
        width: responsiveWidth(18),
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 10,
        paddingVertical: 10,
    },
    filterView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 20,
        paddingVertical: responsiveWidth(1),
        paddingHorizontal: responsiveWidth(2),
        marginHorizontal: responsiveWidth(1),
        marginVertical: responsiveHeight(1),
    },
    itemList: {
        backgroundColor: colors.newPrimary,
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(3),
        marginVertical: responsiveHeight(1),
        marginHorizontal: responsiveWidth(1),
        flex: 1,
        // borderColor: colors.newSecondary,
        // borderWidth: 0.6,
        // borderRadius: 8,
    },
    dateTimeView: {
        borderRadius: 12,
        paddingVertical: 4,
        borderBottomColor: colors.newSecondary,
        borderBottomWidth: 0.6,
    },
    dateTimeStyle: {
        padding: 2,
        borderRadius: 4,
        width: '48%',
        paddingVertical: responsiveHeight(1),
    },
    userDetail: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: responsiveHeight(2),
    },
    carImageContainer: {
        flex: 1,
        backgroundColor: colors.newSecondary,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 10,
    },
    fromToIconsView: {
        flex: 1,
        justifyContent: 'space-around',
        marginHorizontal: responsiveWidth(1), marginLeft: responsiveWidth(3)
    },
    fromToIcons: {
        flex: 1,
        marginVertical: 4,
        width: null,
        height: null,
    },
    fromToView: {
        flex: 2,
    },
    rideDetailsView: {
        flex: 2,
    },
    rideDetailsTop: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    seatContainer: {
        flexGrow: 1,
        margin: 4,
        flexDirection: 'row',
    },
    seatContainerText: {
        padding: 8,
        height: responsiveFontSize(3),
        minWidth: 50,
        textAlign: 'center',
        backgroundColor: colors.newSecondary,
        color: colors.newPrimary,
        borderRadius: 8,
        overflow: 'hidden',
        marginLeft: 3,
    },
    createdDate: {
        alignSelf: 'flex-end',
        color: colors.inactiveGray,
        fontSize: 8,
        marginRight: 6,
        marginTop: 6,
    },
    buttonView: {
        justifyContent: 'flex-end',
        marginVertical: responsiveHeight(1)
    },

    separator: {
        width: '100%',
        height: 1,
        backgroundColor: colors.newSecondary,
        marginVertical: responsiveHeight(1),
    },
});

export default styles;
