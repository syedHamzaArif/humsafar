import { responsiveWidth } from '#util/responsiveSizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flexGrow: 1,
        paddingHorizontal: responsiveWidth(12),
    },
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
