import images from '#assets/';
import Typography from '#components/common/Typography';
import { colors } from '#res/colors';
import { getValue } from '#util/';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Image } from 'react-native-elements/dist/image/Image';

const SeatOrder = ({ seatingOrder, setSeatingOrder }) => {

    const [editMode, setEditMode] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState(null);

    const itemPressHandler = _index => {
        if (selectedSeat === null) {
            setSelectedSeat(_index);
        } else if (selectedSeat === _index) {
            setSelectedSeat(null);
        } else {
            const updatedSeatOrder = [...seatingOrder];
            // const updatedValue = updatedSeatOrder[selectedSeat];
            // updatedSeatOrder[selectedSeat] = updatedSeatOrder[_index];
            // updatedSeatOrder[_index] = updatedValue;
            [updatedSeatOrder[selectedSeat], updatedSeatOrder[_index]] = [updatedSeatOrder[_index], updatedSeatOrder[selectedSeat]];
            setSeatingOrder(updatedSeatOrder);
            setSelectedSeat(null);
        }
    };

    return (
        <View style={styles.root}>
            <TouchableOpacity
                style={[
                    styles.editModeView,
                    { backgroundColor: editMode ? colors.primary : colors.lightGray },
                ]}
                activeOpacity={1} onPress={setEditMode.bind(this, !editMode)} >
                <Typography variant="semiBold" color={editMode ? colors.white : colors.textPrimary}
                    size={14}>
                    Edit Seat Order
                </Typography>
                <Icon name="pencil" type="foundation" size={20}
                    color={editMode ? colors.white : colors.buttonGray}
                    containerStyle={{ marginLeft: 4 }}
                />
            </TouchableOpacity>
            <View style={styles.seatingOrderView}>
                {
                    seatingOrder.map((item, index) => (
                        <TouchableOpacity
                            key={`seatingOrder${index}`}
                            activeOpacity={1}
                            disabled={item === 'driver' || !editMode}
                            style={[
                                styles.item,
                                editMode && styles.editItem,
                                selectedSeat === index && { backgroundColor: colors.primaryGreen },
                            ]}
                            onPress={itemPressHandler.bind(this, index)}
                        >
                            <Image source={images.carSeat}
                                style={{
                                    width: 50, height: 80,
                                    tintColor:
                                        selectedSeat === index ? colors.white :
                                            item === 'with-driver' ? colors.primaryOrange :
                                                item === 'driver' ? colors.warning :
                                                    item === 'passenger' ? colors.primaryGreen :
                                                        colors.black,
                                }}
                                resizeMode="contain" />
                            <Typography variant="semiBold" size={12}
                                color={selectedSeat === index ? colors.white : colors.textPrimary} >
                                {getValue(item)}
                            </Typography>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    editModeView: {
        marginTop: responsiveHeight(3),
        marginRight: responsiveWidth(3),
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        borderRadius: 12,
        padding: 6,
    },
    seatingOrderView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: responsiveHeight(5),
    },
    item: {
        borderRadius: 12,
        minWidth: responsiveWidth(48),
        margin: responsiveWidth(1),
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        padding: responsiveWidth(3),
    },
    editItem: {
        backgroundColor: colors.lightGray,
    },
});

export default SeatOrder;
