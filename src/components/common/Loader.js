import { colors } from '#res/colors';
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const Loader = (props) => {
    return (
        <View style={styles.root}>
            <ActivityIndicator size={40} color={colors.secondary} />
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        justifyContent: 'center',
        alignItems: 'center',
        ...StyleSheet.absoluteFill,
        backgroundColor: '#eee',
        zIndex: 10,
        opacity: 0.6,
        // flex: 1,
    },
});

export default Loader;
