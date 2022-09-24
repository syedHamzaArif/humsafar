import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import { responsiveFontSize } from '#util/responsiveSizes';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import styles from './CreateRide/Pricing/pricing.styles';

const VehicleAdditionalInfo = ({
    stateChange, isAc, isLuggage, isSmoking, isMusic,
}) => {
    return (
        <View style={styles.details}>
            <TouchableOpacity style={styles.detail} activeOpacity={0.4}
                onPress={stateChange.bind(this, 'isAc', !isAc)} >
                <Icon name="snowflake-o" type="font-awesome" size={responsiveFontSize(2)}
                    color={isAc ? colors.newAccent : colors.secondary} />
                <Typography new size={12} style={styles.detailTitle}
                    color={isAc ? colors.newAccent : colors.secondary} >AC</Typography>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detail} activeOpacity={0.4}
                onPress={stateChange.bind(this, 'isLuggage', !isLuggage)} >
                <Icon name="luggage" type="material" size={responsiveFontSize(2)}
                    color={isLuggage ? colors.newAccent : colors.secondary} />
                <Typography new size={12} style={styles.detailTitle}
                    color={isLuggage ? colors.newAccent : colors.secondary} >Luggage</Typography>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detail} activeOpacity={0.4}
                onPress={stateChange.bind(this, 'isSmoking', !isSmoking)} >
                <Icon name="smoking-rooms" type="material" size={responsiveFontSize(2)}
                    color={isSmoking ? colors.newAccent : colors.secondary} />
                <Typography new size={12} style={styles.detailTitle}
                    color={isSmoking ? colors.newAccent : colors.secondary} >Smoking</Typography>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detail} activeOpacity={0.4}
                onPress={stateChange.bind(this, 'isMusic', !isMusic)} >
                <Icon name="music" type="font-awesome" size={responsiveFontSize(2)}
                    color={isMusic ? colors.newAccent : colors.secondary} />
                <Typography new size={12} style={styles.detailTitle}
                    color={isMusic ? colors.newAccent : colors.secondary} >Music</Typography>
            </TouchableOpacity>
        </View>
    );
};

export default VehicleAdditionalInfo;
