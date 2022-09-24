import React from 'react';
import Login from '#containers/Auth/Login';
import MobileNumber from '#containers/Auth/MobileNumber';
import OTP from '#containers/Auth/OTP';
import ResetPassword from '#containers/Auth/ResetPassword';
import SignUp from '#containers/Auth/SignUp';
import { colors } from '#res/colors';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
    <AuthStack.Navigator
        screenOptions={params => ({
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            cardStyle: { backgroundColor: colors.newPrimary },
        })}
        mode="card"
        headerMode="none"
    >
        <AuthStack.Screen name="MobileNumber" component={MobileNumber} />
        <AuthStack.Screen name="OTP" component={OTP} />
        <AuthStack.Screen name="Login" component={Login} />
        <AuthStack.Screen name="SignUp" component={SignUp} />
        <AuthStack.Screen name="Reset Password" component={ResetPassword} />
    </AuthStack.Navigator>
);

export default AuthStackScreen;
