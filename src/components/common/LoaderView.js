import { colors } from '#res/colors';
import { responsiveWidth } from '#util/responsiveSizes';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const LoaderView = ({ media, progress }) => {
    return (
        <View style={styles.root}>
            {
                media ?
                    <ProgressBar style={{ width: responsiveWidth(50), height: 10, borderRadius: 10 }}
                        color={colors.primary} progress={progress} />
                    :
                    <ActivityIndicator size={24} color={colors.primary} />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        opacity: 0.7,
        zIndex: 1,
    },
});

export default LoaderView;
