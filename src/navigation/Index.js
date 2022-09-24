import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from '#context/index';
import { NavigationContainer } from '@react-navigation/native';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import RootStackScreen from './RootStack/RootStack';
import Geocoder from 'react-native-geocoding';
import { Service } from '#config/service';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import { clearnotificationdata, clearridedata, clearuserdata, updatedata, updatenotificationdata, updateridedata } from '#redux/actions/actionCreators';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '#components/common/Modal';
import LogoutComponent from './LogoutComponent';
import NotificationDialog from './NotificationDialog';
import { updateReducer } from '#util/';
import RNOtpVerify from 'react-native-otp-verify';
import { isIOS } from '#util/';
import Config from 'react-native-config';

console.log('Config.ENVTYPE', Config.ENVTYPE);
console.log('Config.SERVER', Config.SERVER);

const AppNavigation = ({ }) => {

    const { userData } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const updateUserData = (data) => dispatch(updatedata(data));
    const updateRideData = (data) => dispatch(updateridedata(data));
    const clearNotificationsData = () => dispatch(clearnotificationdata());
    const clearUserData = () => dispatch(clearuserdata());
    const clearRideData = () => dispatch(clearridedata());

    const { unread, notifications } = useSelector(state => state.notificationReducer);
    const updateNotificationData = data => dispatch(updatenotificationdata(data));


    const navigationRef = useRef(null);
    const flashMessageRef = useRef(null);

    const [userToken, setUserToken] = useState('');
    const [onboarding, setOnboarding] = useState('');
    const [firebaseToken, setFirebaseToken] = useState('');
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    // const [sessionExpiredModalVisible, setSessionExpiredModalVisible] = useState(false);
    // const [noNetworkModalVisible, setNoNetworkModalVisible] = useState(false);
    const [notificationModalVisible, setNotificationModalVisible] = useState(false);
    const [notificationData, setNotificationData] = useState(null);


    const authContext = useMemo(() => {
        return {
            onboard: () => {
                setOnboarding('true');
                AsyncStorage.setItem('@onboarding', 'true');
            },
            signIn: async (_data) => {
                try {
                    const obj = { ..._data, firebase_token: firebaseToken };
                    const { status, data } = await Service.login(obj);
                    if (status === true) {
                        await authContext.userInfo(data.access_token);
                    }
                } catch (error) {
                    throw error;
                }
            },
            signup: async (data) => {
                try {
                    const { message } = await Service.register(data);
                    if (message === 'Successfully created user!') {
                        let obj = {
                            cell_no: data.cell_no,
                            password: data.password,
                        };
                        await authContext.signIn(obj);
                    }
                    // if (_result && _result.Status === false) {
                    //   throw _result.Data;
                    // } else {
                    //   let obj = {
                    //     username: `${data.EmailPh}-2`,
                    //     password: data.Password,
                    //     grant_type: 'password',
                    //   };
                    //   await authContext.signIn(obj);
                    //   result = true;
                    //   return result;
                    // }
                } catch (error) {
                    throw error;
                }
            },
            userInfo: async (token) => {
                let result = false;
                try {
                    const { data } = await Service.userInfo(token);
                    if (data) {
                        AsyncStorage.setItem('@userToken', token);
                        if (JSON.stringify(data) === JSON.stringify(userData)) {
                            console.log('No changes');
                        } else {
                            let updatedUserData = { name: 'userData', value: { ...data } };
                            updateUserData(updatedUserData);
                        }
                        setUserToken(token);
                        result = true;
                    } else {
                        return result;
                    }
                } catch (error) {
                    console.log('authContext -> error', error);
                    throw result;
                }
                return result;
            },
            signOut: () => {
                setLogoutModalVisible(true);
            },
            showFlashMessage: (body) => {
                showMessage(body);
            },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firebaseToken, userData]);

    const signOutHandler = async (_type) => {
        setLogoutLoading(true);
        try {
            if (_type === 'logout') {
                const data = { firebaseToken };
                await Service.logout(data);
            }
            setUserToken(null);
            AsyncStorage.removeItem('@userToken');
        } catch (error) {
        } finally {
            setLogoutLoading(false);
            // setSessionExpiredModalVisible(false);
            setLogoutModalVisible(false);
            setUserToken(null);
            AsyncStorage.removeItem('@userToken');
            clearNotificationsData();
            clearUserData();
            clearRideData();
        }
    };

    const notificationPressHandler = async (data) => {
        const { type, notification_id } = data;
        setNotificationModalVisible(false);

        switch (type) {
            case 'ride-started':
                navigationRef.current.navigate('Active Ride', { userType: 'passenger', rideId: data.ride_id });
                updateReducer('status', 'Progress', updateRideData);
                break;

            case 'ride-request':
            case 'transport-request':
            case 'ride-request-accept':
                navigationRef.current.navigate('NotificationDetails', { data, from: 'notification' });
                updateReducer('status', 'Active', updateRideData);
                break;

            case 'ride-request-reject':
                navigationRef.current.navigate('NotificationDetails', { data, from: 'notification' });
                break;

            case 'ride-completed':
                updateReducer('status', 'Completed', updateRideData);
                break;

            case 'ride-cancelled':
                updateReducer('status', 'Completed', updateRideData);
                break;

            default:
                setNotificationModalVisible(false);
                break;
        }
        const { status } = await Service.readNotification({ notification_id });
        if (status && unread) {
            const updatedReadCount = { name: 'unread', value: unread - 1 };
            updateNotificationData(updatedReadCount);
            const updatedNotifications = [...notifications];
            const currentIndex = updatedNotifications.findIndex(element => +element.notification_id === +notification_id);
            if (currentIndex !== -1) {
                updatedNotifications[currentIndex].read = true;
                updateNotificationData({ name: 'notifications', value: updatedNotifications });
            }
        }

    };

    const getFcmToken = async () => {
        try {
            let result = false;
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                // console.log('Authorization status:', authStatus);
            }

            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                console.log('getFcmToken -> fcmToken', fcmToken);
                result = fcmToken;
                setFirebaseToken(fcmToken);
            }
            return result;
        } catch (error) {
            console.log('Inside Catch => ', error);
        }
    };

    const requestFirebasePermission = async () => {
        try {
            let result;
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            // console.log('requestPermission -> enabled', enabled);
            if (enabled) {
                // if (!messaging().isDeviceRegisteredForRemoteMessages) {
                //     await messaging().registerDeviceForRemoteMessages();
                // }
                await getFcmToken().then(res => { result = res; });
            }
            else {
                result = 'auth failed';
                console.warn('Authorization failed:', authStatus);
            }
            return result;
        } catch (error) {
            console.trace('Inside Catch => ', error);
        }

    };

    const init = async () => {
        requestFirebasePermission();
        await AsyncStorage.getItem('@userToken').then(async (value) => {
            try {
                // if (!value) return;
                const { data } = await Service.userInfo(value);
                // let { data } = { name: 'userData', value: profileResult.Data };
                let updatedUserData = { name: 'userData', value: { ...data } };
                updateUserData(updatedUserData);
                setUserToken(value);
                // return result;
            } catch (error) {
                setUserToken('');
                console.log('init -> error', error);
            } finally {
                setTimeout(() => {
                    SplashScreen.hide();
                }, 300);
            }
        });

        // App foreground
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            console.log('file: Index.js => line 253 => unsubscribe => remoteMessage', remoteMessage);
            try {
                if (remoteMessage) {
                    setNotificationData(remoteMessage);
                    setNotificationModalVisible(true);
                }
            } catch (error) {
            }
        });

        messaging().getInitialNotification().then(remoteMessage => {
            try {
                if (remoteMessage) {
                    setNotificationData(remoteMessage);
                    setNotificationModalVisible(true);
                }
            } catch (error) {
            }
        });

        messaging().onNotificationOpenedApp(remoteMessage => {
            try {
                if (remoteMessage) {
                    setNotificationData(remoteMessage);
                    setNotificationModalVisible(true);
                }
            } catch (error) {
            }
        });

        return () => {
            unsubscribe();
        };
    };


    const internetConnectionHandler = () => {
        const unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
            if (!isConnected) {
                setTimeout(() => {
                    // setNoNetworkModalVisible(true);
                }, 1000);
            } else {
                // setNoNetworkModalVisible(false);
            }
        });
        return () => {
            unsubscribe();
        };
    };

    const appHashHandler = async () => {
        if (isIOS()) return;
        const result = await RNOtpVerify.getHash();
        AsyncStorage.getItem('appHash', hash => {
            if (!hash) AsyncStorage.setItem('appHash', result[0]);
        });
        return result[0];
    };

    useEffect(() => {
        appHashHandler();
        Geocoder.init('AIzaSyCCwcF2upQ4L3gCXnhhps6EO_pCcSFbcEU');
        init();
        internetConnectionHandler();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <AuthContext.Provider value={authContext}>
                <NavigationContainer ref={navigationRef}>
                    <RootStackScreen
                        userToken={userToken}
                        onboarding={onboarding}
                    />
                </NavigationContainer>
                <FlashMessage ref={flashMessageRef} />
            </AuthContext.Provider>
            <Modal setVisible={setLogoutModalVisible} visible={logoutModalVisible}>
                <LogoutComponent cancelHandler={() => setLogoutModalVisible(false)}
                    pressHandler={signOutHandler.bind(this, 'logout')} loading={logoutLoading}
                />
            </Modal>
            <Modal visible={notificationModalVisible}
                onBackdropPress={notificationPressHandler.bind(this, notificationData?.data)}
                setVisible={setNotificationModalVisible} >
                <NotificationDialog data={notificationData} pressHandler={notificationPressHandler} />
            </Modal>
        </>
    );
};


export default AppNavigation;
