import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import styles from '#components/CreateRide/Ride/ride.styles';
import Typography from '#components/common/Typography';
import images from '#assets/';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { colors } from '#res/colors';
import { Icon } from 'react-native-elements';
import { hitSlop } from '#util/';

const PickAndDrop = ({
    pickupCityLocation,
    dropOffCityLocation,
    start_address = '',
    end_address = '',
    pressHandler,
    remove,
}) => {

    return (
        <View>
            <View style={styles.row}>
                <View style={styles.heading}>
                    <Typography new variant="semiBold" >Enter your ride details</Typography>
                </View>
                {
                    remove &&
                    <Icon name="delete-outline" type="material-community"
                        size={20} style={{ padding: 5 }}
                        containerStyle={{ padding: 3 }}
                        onPress={remove} underlayColor="transparent"
                        hitSlop={hitSlop} color={colors.secondary} />
                }
            </View>
            <View style={styles.fromToStyling}>
                <View style={{ justifyContent: 'space-around' }} >
                    <Image source={images.ic_from} resizeMode="contain" style={styles.fromToIcons} />
                    <Image source={images.ic_to} resizeMode="contain" style={styles.fromToIcons} />
                </View>
                <View style={{ flex: 1, marginLeft: responsiveWidth(3) }}>
                    <TouchableOpacity style={{ height: responsiveHeight(5) }} activeOpacity={0.9} onPress={pressHandler.bind(this, 'startRegion')}>
                        <Typography variant="semiBold" color={colors.primary}>From</Typography>
                        <Typography variant="small" color={colors.textPrimary}>{pickupCityLocation ? `${pickupCityLocation}, ${start_address}` : 'City, Street Address'}</Typography>
                    </TouchableOpacity>
                    <Image resizeMode="contain" source={images.verticalLine} style={{ width: '100%', height: 10 }} />
                    <TouchableOpacity style={{ height: responsiveHeight(5) }} activeOpacity={0.9} onPress={pressHandler.bind(this, 'destinationRegion')}>
                        <Typography variant="semiBold" color={colors.primary}>To</Typography>
                        <Typography variant="small" color={colors.textPrimary}>{dropOffCityLocation ? `${dropOffCityLocation}, ${end_address}` : 'City, Street Address'}</Typography>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default PickAndDrop;
