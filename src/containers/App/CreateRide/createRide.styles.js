import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        backgroundColor: colors.white,
    },
    header: {
        // position: 'absolute',
        height: responsiveHeight(20),
    },
    headerTabsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerNumber: {
        backgroundColor: colors.newSecondary,
        color: colors.newPrimary,
        width: 26, height: 26,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    headerNumberBordered: {
        borderColor: colors.newAccent,
        backgroundColor: 'transparent',
        padding: 2,
        borderWidth: 2,
        borderRadius: 20,
    },
    headerBox: {
        flex: 1,
        alignItems: 'center',
        // flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: responsiveWidth(1),
        // backgroundColor: colors.backgroundPrimary,
        paddingVertical: responsiveHeight(2),
    },
    next: {
        width: responsiveWidth(30),
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.newSecondary,
        paddingVertical: responsiveHeight(2),
        marginBottom: responsiveHeight(1),
        borderBottomLeftRadius: 30,
        borderTopLeftRadius: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    back: {
        width: responsiveWidth(30),
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.newSecondary,
        paddingVertical: responsiveHeight(2),
        marginBottom: responsiveHeight(1),
        borderBottomRightRadius: 30,
        borderTopRightRadius: 10,
    },
});

export default styles;
