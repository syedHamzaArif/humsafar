import { colors } from '#res/colors';
import { getFonts } from '#util/';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveHeight(3),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    carDetailContainer: {
        backgroundColor: colors.newSecondary,
        borderRadius: 12,
        padding: 8,
    },
    chooseCarButton: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 8,
        paddingHorizontal: responsiveHeight(0.5),
    },
    input: {
        // backgroundColor: colors.white,
        borderBottomColor: colors.newPrimary,
        borderBottomWidth: 0.6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        color: colors.newPrimary,
        paddingHorizontal: responsiveWidth(3),
        width: '47%',
        height: responsiveHeight(5),
        justifyContent: 'center',
        fontFamily: getFonts().semiBold,
    },
    imagePress: {
        padding: 2,
        backgroundColor: colors.white,
        borderRadius: 12,
        borderColor: colors.newPrimaryGrey,
        borderWidth: 0.5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        color: colors.newPrimary,
        paddingHorizontal: responsiveWidth(3),
        height: responsiveFontSize(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(2),
    },
    images: {
        width: 80,
        height: 50,
        overflow: 'hidden',
    },
    modalStyle: {
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingHorizontal: responsiveWidth(5),
        paddingVertical: responsiveHeight(5),
    },
    cameraButton: {
        // width: '90%',
        backgroundColor: colors.newPrimary,
        alignItems: 'center',
        paddingVertical: responsiveHeight(1),
        borderRadius: 8,
        marginHorizontal: responsiveWidth(10),
    },
    uploadedImage: {
        width: responsiveFontSize(4),
        height: responsiveFontSize(4),
        margin: 5,
    }
});

export default styles;
