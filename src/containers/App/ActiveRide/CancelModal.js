import Button from '#components/common/Button';
import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const CancelModal = ({ setVisible, pressHandler }) => {
    return (
        <View style={styles.root}>
            <Typography style={{ marginVertical: responsiveHeight(2), textAlign: 'center' }}
                variant="semiBold" size={14} >
                Are you sure you want to cancel your ride?
            </Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                <Button title="No" style={{ width: responsiveWidth(36), backgroundColor: colors.warning }} onPress={setVisible.bind(this, false)} />
                <Button title="Yes" onPress={pressHandler} style={{ width: responsiveWidth(36) }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: colors.white,
        padding: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
});

export default CancelModal;
