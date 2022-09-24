import images from '#assets/';
import BookRide from '#components/BookRide';
import EmptyComponent from '#components/common/EmptyComponent';
import Loader from '#components/common/Loader';
import Modal from '#components/common/Modal';
import Typography from '#components/common/Typography';
import { Service } from '#config/service';
import { colors } from '#res/colors';
import { responsiveHeight, responsiveWidth } from '#util/responsiveSizes';
import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const myTransportActionItems = (navigation, itemPressHandler) => ([
    {
        id: 0, title: 'Details',
        action: item => navigation.navigate('Ride Details', { item: item, itemPressHandler: itemPressHandler.bind(this, item) }),
    },
]);

const MyTransporter = ({ navigation }) => {
    const [rides, setRides] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setIsLoading(true);
        try {
            const { data } = await Service.getMyTransports();
            setRides(data);
        } catch (error) {
            console.trace('Inside Catch => ', error);
        } finally {
            setIsLoading(false);
        }
    };

    const itemPressHandler = _item => {
        navigation.navigate('Ride Details', { item: _item });
    };

    const actionItems = myTransportActionItems(navigation, itemPressHandler);

    const _renderItem = (props) => <BookRide key={`${props.index}rideItem`}
        itemPressHandler={itemPressHandler}
        {...props} actionItems={actionItems}
    />;


    return (
        <View style={styles.root} >
            {
                isLoading ? <Loader /> :
                    <FlatList
                        data={rides}
                        showsVerticalScrollIndicator={false}
                        renderItem={_renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ flexGrow: 1 }}
                        ListEmptyComponent={<EmptyComponent title="No Transport Found" />}
                    />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.backgroundWhite,
        paddingHorizontal: responsiveWidth(5),
    },
    searchBar: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: colors.white,
        elevation: 5,
        borderRadius: 8,
        marginVertical: responsiveHeight(2),
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemList: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        backgroundColor: colors.white,
        elevation: 5,
        borderRadius: 4,
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(3),
        marginVertical: responsiveHeight(1),
        marginHorizontal: responsiveWidth(1),
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: responsiveHeight(0.8),
        paddingHorizontal: responsiveWidth(1),
        marginHorizontal: responsiveWidth(0.5),
        width: responsiveWidth(40),
        alignItems: 'center',
    },
});

export default MyTransporter;
