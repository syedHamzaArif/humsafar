import React from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import images from '#assets/index';

const ImageLoader = () => {

    return <LottieView style={StyleSheet.absoluteFill}
        source={images.homeLoader} autoPlay loop />;
};

export default ImageLoader;
