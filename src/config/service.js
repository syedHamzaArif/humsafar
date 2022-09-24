import { Apis, get, patch, post, destroy, postOTP } from './';
import AsyncStorage from '@react-native-community/async-storage';
import { getFilterUrl } from '#util/index';

export const getToken = () => AsyncStorage.getItem('@userToken').then((value) => value);

export const Service = {
    register: async (data) => {
        let result = await post(Apis.register, data);
        if (result.status === 200) return result.data;
        else throw result;
    },
    login: async (data) => {
        let result = await post(Apis.login, data);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getOTP: async (phoneNumber, code) => {
        const hash = await AsyncStorage.getItem('appHash');
        let result = await postOTP(phoneNumber, code, hash);
        if (result.status === 200) return result.data;
        else throw result;
    },
    logout: async (data) => {
        const token = await getToken();
        let result = await post(Apis.logout, data, token);
        if (result.status === 200) return result.data;
        else throw result;
    },
    userInfo: async (token) => {
        let result = await get(Apis.userInfo, token);
        if (result.status === 200) return result.data;
        else throw result;
    },
    cellExist: async (num) => {
        let result = await get(`${Apis.cellExist}?cell=${num}`);
        if (result.status === 200) return result.data;
        else throw result;
    },
    updateProfile: async (data) => {
        const token = await getToken();
        let result = await patch(Apis.updateProfile, data, token);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getProfile: async (_id) => {
        const token = await getToken();
        let result = await get(`${Apis.getProfile}?id=${_id}`, token);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getProfession: async (num) => {
        let result = await get(`${Apis.getProfession}`);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getModel: async (filters = {}) => {
        let updatedUrl = Apis.getModel + '?';
        Object.entries(filters).map(([key, value], index) => {
            updatedUrl = `${updatedUrl}&${key}=${value ?? ''}`;
        });
        let result = await get(updatedUrl);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getVehicleTypes: async () => {
        let result = await get(Apis.getVehicleTypes);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getYear: async () => {
        let result = await get(`${Apis.getYear}`);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getMaker: async () => {
        let result = await get(`${Apis.getMaker}`);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getUserVehicle: async () => {
        const updatedToken = await getToken();
        let result = await get(Apis.userVehicle, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    userVehicle: async (data) => {
        const updatedToken = await getToken();
        const headers = {
            'Content-Type': 'multipart/form-data',
        };
        let result = await post(Apis.userVehicle, data, updatedToken, headers);
        if (result.status === 200) return result.data;
        else throw result;
    },
    updateUserVehicle: async (data) => {
        const updatedToken = await getToken();
        const headers = {
            'Content-Type': 'multipart/form-data',
        };
        let result = await patch(Apis.updateUserVehicle, data, updatedToken, headers);
        if (result.status === 200) return result.data;
        else throw result;
    },
    createRide: async (data) => {
        const updatedToken = await getToken();
        let result = await post(Apis.createRide, data, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    createTransporter: async (data) => {
        const updatedToken = await getToken();
        let result = await post(Apis.createTransports, data, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    deleteTransports: async (data) => {
        const updatedToken = await getToken();
        let result = await destroy(`${Apis.createTransports}?id=${data}`, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getRides: async (filters = {}, start, row) => {
        const updatedToken = await getToken();
        const updatedUrl = getFilterUrl(`${Apis.allRides}?start=${start}&rows=${row}`, filters);
        let result = await get(updatedUrl, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getRide: async ride_id => {
        const updatedToken = await getToken();
        let result = await get(`${Apis.ride}?ride_id=${ride_id}`, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getMyRides: async () => {
        const updatedToken = await getToken();
        let result = await get(Apis.myRides, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getMyBookings: async () => {
        const updatedToken = await getToken();
        let result = await get(Apis.myBookings, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getTransports: async filters => {
        const updatedToken = await getToken();
        const updatedUrl = getFilterUrl(Apis.allTransports, filters);
        let result = await get(updatedUrl, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getTransport: async id => {
        const updatedToken = await getToken();
        let result = await get(`${Apis.transport}?transporter_id=${id}`, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getMyTransports: async () => {
        const updatedToken = await getToken();
        let result = await get(Apis.getMyTransports, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },

    requestBookRide: async data => {
        const updatedToken = await getToken();
        let result = await post(Apis.requestBookRide, data, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    requestTransportRide: async data => {
        const updatedToken = await getToken();
        let result = await post(Apis.requestTransportRide, data, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getUser: async (id, showVehicle) => {
        const updatedToken = await getToken();
        let result = await get(`${Apis.user}?id=${id}&vehicle=${showVehicle}`, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    acceptRideBooking: async data => {
        const updatedToken = await getToken();
        let result = await post(Apis.acceptRideBooking, data, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    acceptTransportBooking: async data => {
        const updatedToken = await getToken();
        let result = await post(Apis.acceptTransportBooking, data, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    rejectRideBooking: async data => {
        const updatedToken = await getToken();
        let result = await post(Apis.rejectRideBooking, data, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getNotifications: async data => {
        const updatedToken = await getToken();
        let result = await get(Apis.userNotifications, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    readNotification: async data => {
        const updatedToken = await getToken();
        let result = await post(Apis.readNotification, data, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    checkActiveRide: async () => {
        const updatedToken = await getToken();
        let result = await get(Apis.checkActiveRide, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    checkPassengerActiveRide: async () => {
        const updatedToken = await getToken();
        let result = await get(Apis.checkPassengerActiveRide, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getActiveRide: async () => {
        const updatedToken = await getToken();
        let result = await get(Apis.getActiveRide, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    startRide: async data => {
        const updatedToken = await getToken();
        let result = await post(Apis.startRide, data, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    endRide: async data => {
        const updatedToken = await getToken();
        let result = await post(Apis.endRide, data, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    cancelRide: async data => {
        const updatedToken = await getToken();
        let result = await post(Apis.cancelRide, data, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getUserTransports: async () => {
        const updatedToken = await getToken();
        let result = await get(Apis.userTransports, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getAvailableSeats: async rideId => {
        const updatedToken = await getToken();
        let result = await get(`${Apis.getAvailableSeats}?ride_id=${rideId}`, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    postReview: async review => {
        const updatedToken = await getToken();
        let result = await post(Apis.review, review, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getReview: async review_id => {
        const updatedToken = await getToken();
        let result = await get(`${Apis.review}?review_id=${review_id}`, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getReviewParams: async filters => {
        const updatedToken = await getToken();
        const updatedUrl = getFilterUrl(Apis.reviewParams, filters);
        let result = await get(updatedUrl, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    changePassword: async data => {
        const updatedToken = await getToken();
        let result = await post(Apis.changePassword, data, updatedToken);
        if (result.status === 200) return result.data;
        else throw result;
    },
    resetPassword: async data => {
        let result = await post(Apis.resetPassword, data);
        if (result.status === 200) return result.data;
        else throw result;
    },
    getPassengerPreferences: async () => {
        let result = await get(Apis.passengerPreferences);
        if (result.status === 200) return result.data;
        else throw result;
    },
};

