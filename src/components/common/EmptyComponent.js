import { colors } from '#res/colors';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { View } from 'react-native';
import Typography from './Typography';

const EmptyComponent = ({ title, loading }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {
                loading ?
                    <ActivityIndicator size={30} color={colors.primary} />
                    :
                    <Typography variant="bold" style={{ color: 'black', fontSize: 20 }}>
                        {title}
                    </Typography>
            }
        </View>
    );
};

export default EmptyComponent;
