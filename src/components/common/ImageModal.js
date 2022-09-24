import { colors } from '#res/colors';
import { hitSlop } from '#util/';
import { width, height } from '#util/';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import ImageZoom from 'react-native-image-pan-zoom';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ImageModal = ({ image, modalVisible }) => {
    return (
        <View style={styles.root}>
            <Icon name="cross" type="entypo"
                size={30} color={colors.white}
                onPress={() => modalVisible(false)}
                hitSlop={hitSlop}
                containerStyle={[styles.crossIcon, { top: useSafeAreaInsets().top / 2 }]} />
            <ImageZoom
                cropWidth={width}
                imageWidth={width}
                imageHeight={height}
                cropHeight={height}
            >
                <Image source={{ uri: image }}
                    resizeMode="contain" style={{ flex: 1, width: null, height: null }} />
            </ImageZoom>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,

    },
    crossIcon: {
        position: 'absolute',
        zIndex: 2,
        right: 0,
        paddingRight: responsiveWidth(2),
        paddingTop: responsiveHeight(2),
    },
});

export default ImageModal;
