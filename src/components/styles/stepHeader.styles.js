import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
        justifyContent: 'center',
        paddingHorizontal: responsiveWidth(1),
        paddingVertical: responsiveHeight(2),
    },
});

export default styles;
