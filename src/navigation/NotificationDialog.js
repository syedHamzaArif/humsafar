import Button from '#components/common/Button';
import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const NotificationDialog = ({ data = {}, pressHandler }) => {

    return (
        <View style={styles.root}>
            <View style={{ marginHorizontal: responsiveWidth(2) }} >
                <Typography variant="bold" lineHeight={30}>{data?.notification.title ?? 'Title'}</Typography>
                <Typography>{data?.notification?.body ?? 'Description'}</Typography>
            </View>
            <Button onPress={pressHandler.bind(this, data.data)}
                style={{ maxWidth: responsiveWidth(40), minWidth: responsiveWidth(30), alignSelf: 'center', marginVertical: responsiveHeight(2), backgroundColor: colors.primary, height: 40 }}
                title="OK"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 10,
        paddingVertical: 10,
        // justifyContent: 'center',
        // alignItems: 'center',
    },

});

export default NotificationDialog;
