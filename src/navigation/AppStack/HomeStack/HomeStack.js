import { colors } from '#res/colors';
import { getFonts, hitSlop } from '#util/index';
import { responsiveWidth } from '#util/responsiveSizes';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from '#containers/App/Home/Home';
import CreateRide from '#containers/App/CreateRide';
import { Image, TouchableOpacity } from 'react-native';
import images from '#assets/index';
import BookRide from '#containers/App/BookRide';
import MyBooking from '#containers/App/DrawerScreens/MyBookings';
import MyPassenger from '#containers/App/DrawerScreens/MyPassengers';
import MyRide from '#containers/App/DrawerScreens/MyRide';
import Notifications from '#containers/App/Notifications';
import MyProfile from '#containers/App/MyProfile';
import RideDetails from '#containers/App/DrawerScreens/MyRide/RideDetails';
import CreateTransporter from '#containers/App/DrawerScreens/CreateTransporter';
import BookTransporter from '#containers/App/Transporter/BookTransporter/bookTransporter';
import MyTransporter from '#containers/App/DrawerScreens/MyTransporter';
import NotificationDetails from '#containers/App/NotificationDetails/NotificationDetails';
import ActiveRide from '#containers/App/ActiveRide/ActiveRide';
import PassengerDetails from '#containers/App/DrawerScreens/MyRide/PassengerDetails';
import ChangePassword from '#containers/App/MyProfile/ChangePassword/ChangePassword';
import Review from '#containers/App/Review/Review';

const HomeStack = createStackNavigator();
const HomeStackScreen = () => {

    return (
        <HomeStack.Navigator
            screenOptions={({ navigation, route }) => {
                return ({
                    gestureDirection: 'horizontal',
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                    headerTitleAlign: 'center',
                    cardStyle: { backgroundColor: colors.newPrimary },
                    headerTitleStyle: {
                        color: colors.black,
                        fontSize: 16,
                        fontFamily: getFonts().bold,
                        paddingRight: responsiveWidth(10),
                    },
                    headerRightContainerStyle: {
                        paddingRight: responsiveWidth(5),
                    },
                    headerLeft: () => (
                        <TouchableOpacity onPress={navigation.goBack}
                            hitSlop={hitSlop} activeOpacity={0.7} style={{ alignItems: 'center' }}
                        >
                            <Image source={images.back}
                                style={{ height: 20, width: 20, marginLeft: responsiveWidth(12) }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    ),
                    headerRight: null,
                });
            }}
            mode="card"
        >
            <HomeStack.Screen name="Home" component={Home} />
            <HomeStack.Screen name="Create Ride" component={CreateRide} />
            <HomeStack.Screen name="Book Ride" component={BookRide} />
            <HomeStack.Screen name="My Booking" component={MyBooking} />
            <HomeStack.Screen name="My Passenger" component={MyPassenger} />
            <HomeStack.Screen name="My Ride" component={MyRide} />
            <HomeStack.Screen name="Notifications" component={Notifications} />
            <HomeStack.Screen name="My Profile" component={MyProfile} />
            <HomeStack.Screen name="Change Password" component={ChangePassword} />
            <HomeStack.Screen name="Ride Details" component={RideDetails} />
            <HomeStack.Screen name="Make Me Transporter" component={CreateTransporter} />
            <HomeStack.Screen name="Book Transporter" component={BookTransporter} />
            <HomeStack.Screen name="My Transports" component={MyTransporter} />
            <HomeStack.Screen name="NotificationDetails" options={{ title: 'Notification' }} component={NotificationDetails} />
            <HomeStack.Screen name="Active Ride" component={ActiveRide} />
            <HomeStack.Screen name="Passenger Details" component={PassengerDetails} />
            <HomeStack.Screen name="Review" component={Review} />
        </HomeStack.Navigator>
    );
};

export default HomeStackScreen;
