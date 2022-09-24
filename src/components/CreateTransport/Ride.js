import Typography from '#components/common/Typography';
import PickAndDrop from '#components/PickAndDrop';
import { colors } from '#res/colors';
import { getFonts } from '#util/';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React from 'react';
import { Fragment } from 'react';
import { TextInput } from 'react-native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const Ride = ({ state, removeTransportHandler, placesHandler, priceChangeHandler, addTransportHandler }) => {

    const { transports } = state;

    return (
        <View style={styles.root}>
            {
                transports?.map((item, index) => {
                    return (
                        <Fragment key={`transports${index}`}>
                            <View style={styles.personalDetailStyle}>
                                <PickAndDrop
                                    pickupCityLocation={item.startRegion.cityLocation}
                                    dropOffCityLocation={item.destinationRegion.cityLocation}
                                    pressHandler={placesHandler.bind(this, index)}
                                    remove={transports.length <= 1 ? null : removeTransportHandler.bind(this, index)}
                                />
                            </View>
                            <View>
                                <View style={[styles.row, { marginTop: responsiveHeight(2) }]}>
                                    <Typography new style={{ flex: 2 }} variant="semiBold">Price Per Seat</Typography>
                                    <TextInput
                                        keyboardType="phone-pad"
                                        style={styles.bottomInput}
                                        value={item.price_per_seat}
                                        onChangeText={priceChangeHandler.bind(this, 'price_per_seat', index)}
                                        placeholderTextColor={colors.newPrimary + 'aa'}
                                        placeholder="1500"
                                    />
                                </View>
                                <View style={[styles.row, { marginTop: responsiveHeight(2) }]}>
                                    <Typography new style={{ flex: 2 }} variant="semiBold">Price Full Vehicle</Typography>
                                    <TextInput
                                        keyboardType="phone-pad"
                                        style={styles.bottomInput}
                                        value={item.price_full_vehicle}
                                        onChangeText={priceChangeHandler.bind(this, 'price_full_vehicle', index)}
                                        placeholderTextColor={colors.newPrimary + 'aa'}
                                        placeholder="2000"
                                    />
                                </View>
                            </View>
                        </Fragment>
                    );
                })
            }

            <TouchableOpacity activeOpacity={1} onPress={addTransportHandler}
                style={styles.addRouteButton}>
                <Typography new size={12}
                    variant="semiBold"
                    style={{ marginRight: 6 }} >
                    Add another route
                </Typography>

                <Icon containerStyle={{}}
                    name="pluscircle" type="antdesign"
                    underlayColor="transparent" size={40} />
            </TouchableOpacity>

        </View>
    );
};

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
    personalDetailStyle: {
        marginTop: responsiveHeight(1.5),
        paddingVertical: responsiveHeight(0.5),
    },
    pickUpLocation: {
        height: responsiveHeight(20),
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: responsiveHeight(1),
    },
    mapStyle: {
        ...StyleSheet.absoluteFill,
        width: '100%',
    },
    fromToStyling: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: colors.white,
        borderRadius: 14,
        marginVertical: responsiveHeight(1.5),
        marginHorizontal: responsiveWidth(2),
        paddingVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(2),
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
    },
    bottomInput: {
        backgroundColor: colors.newSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        fontFamily: getFonts().semiBold,
        textAlign: 'center',
        flex: 1,
        height: 30,
        color: colors.newPrimary,
        padding: 0,
    },
    addRouteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveHeight(3),
        alignSelf: 'flex-end',
    },

});

export default Ride;
