import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import { hitSlop, getFonts } from '#util/index';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Button from './Button';
import Typography from './Typography';

const ModalList = ({ name, pressHandler, data, heading, setVisible }) => {

    const renderModalList = ({ item, index }) => {
        const itemData = item?.type ? item?.type : item?.profession ? item?.profession :
            item?.model ? item?.model : item?.year ? item?.year : item?.manufacturer;
        return (
            <TouchableOpacity
                style={styles.ModalView}
                onPress={pressHandler.bind(this, item)}
                hitSlop={hitSlop}
            >
                <Typography color={colors.secondary} variant="semiBold" style={{ paddingVertical: 10 }}>
                    {itemData}
                </Typography>
            </TouchableOpacity>
        );
    };

    return (
        <View
            style={{
                borderRadius: data.length ? 5 : 16,
                ...styles.root,
            }}
        >
            {
                data?.length ?
                    <>
                        <Typography color={colors.secondary} variant="bold" style={{ marginHorizontal: 10, marginTop: 10 }}>
                            {heading}
                        </Typography>
                        <FlatList
                            data={data}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderModalList}
                            keyExtractor={(item, index) => index.toString()}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ flexGrow: 1 }}
                        />
                    </>
                    :
                    <View style={{ margin: responsiveWidth(2), justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
                        <View>
                            <Typography variant="semiBold" size={16} >No {name} found</Typography>
                            <Typography variant="small" size={12} >Try changing filters</Typography>
                        </View>
                        <Button
                            style={{
                                height: 30,
                            }}
                            textStyle={{
                                fontFamily: getFonts().regular,
                                fontSize: 12,
                            }}
                            onPress={setVisible.bind(this, false)} title="Try Again" />
                    </View>

            }
        </View>
    );
};

const styles = StyleSheet.create({
    SearchBarModal: {
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 12,
        height: 45,
        marginVertical: 10,
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    ModalView: {
        borderColor: colors.black,
        paddingHorizontal: 10,
    },
    root: {
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: responsiveHeight(10),
    },
});

export default ModalList;
