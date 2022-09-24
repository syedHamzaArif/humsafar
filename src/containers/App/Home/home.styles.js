import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.white,
    },
    backgroundImages: {
        height: 200,
        width: '100%',
    },
    headerImage: {
        height: 'auto',
        width: responsiveWidth(40),
        resizeMode: 'stretch',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    rowFirst: {
        width: '65%',
        justifyContent: 'space-between',
        paddingLeft: responsiveWidth(10),
    },
    iconContainer: {
        alignItems: 'flex-start',
        marginTop: responsiveHeight(1.5),
    },
    body: {
        flex: 2,
        justifyContent: 'flex-end',
    },
    homeButtonsContainer: {
        flex: 1,
        marginVertical: responsiveHeight(10),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createRide: {
        borderRadius: 10,
        height: responsiveHeight(24),
        overflow: 'hidden',
        justifyContent: 'space-evenly',
        marginVertical: responsiveHeight(5),
        // alignItems: 'center',
    },
    askRider: {
        borderRadius: 10,
        height: responsiveHeight(28),
        overflow: 'hidden',
        justifyContent: 'flex-end',
        padding: 10,
        marginBottom: responsiveHeight(2),
        marginRight: responsiveWidth(2),
        backgroundColor: colors.newPrimaryGrey,
    },
    bookRide: {
        borderRadius: 10,
        height: responsiveHeight(28),
        marginLeft: responsiveWidth(2),
        overflow: 'hidden',
        justifyContent: 'flex-end',
        padding: 10,
        backgroundColor: colors.newPrimaryOrange,
    },
    askRide: {
        borderRadius: 10,
        width: '100%',
        height: 90,
        overflow: 'hidden',
        justifyContent: 'flex-end',
        padding: 10,
        marginTop: responsiveHeight(1),
    },
    badge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.warning,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
        left: responsiveWidth(6), top: 6,
    },
    alertButton: {
        backgroundColor: colors.warning,
        width: responsiveWidth(85),
        alignSelf: 'center',
        marginTop: responsiveHeight(4),
    },
});

export default styles;
