import Axios from './axios';
import AxiosBasic from 'axios';

import { errorHandler } from './errorHandler';

export const Apis = {
    register: 'user/register',
    login: 'user/login',
    userInfo: 'user/me',
    logout: 'user/logout',
    cellExist: 'user/cellExists',
    getProfile: 'user/user',
    getProfession: 'user/getProfession',
    getModel: 'vehicle/model',
    getYear: 'vehicle/years',
    getMaker: 'vehicle/manufacturer/all',
    createRide: 'ride/ride',
    createTransports: 'transport/transports',
    userTransports: 'transport/transports/user',
    allRides: 'ride/ride/all',
    ride: 'ride/ride',
    myRides: 'ride/user/all',
    myBookings: 'ride/booking/user/all',
    allTransports: 'transport/transports/all',
    transport: 'transport/transport',
    getMyTransports: 'transport/transports/user',
    userVehicle: 'vehicle/user',
    updateUserVehicle: 'vehicle/user',
    getVehicleTypes: 'vehicle/types',
    requestBookRide: 'ride/passenger/request',
    requestTransportRide: 'transport/passenger/request',
    getAvailableSeats: 'ride/availableSeats',
    user: 'user/user',
    acceptRideBooking: 'ride/passenger/accept',
    acceptTransportBooking: 'transport/passenger/accept',
    rejectRideBooking: 'ride/passenger/reject',
    userNotifications: 'notification/user/all',
    readNotification: 'notification/read',
    checkActiveRide: 'ride/checkActiveRide',
    checkPassengerActiveRide: 'ride/passenger/checkActiveRide',
    getActiveRide: 'ride/active',
    startRide: 'ride/ride/start',
    endRide: 'ride/ride/end',
    cancelRide: 'ride/ride/cancel',
    updateProfile: 'user/user',
    reviewParams: 'review/params',
    review: 'review/review',
    changePassword: 'user/changePassword',
    resetPassword: 'user/resetPassword',
    passengerPreferences: 'ride/passenger/preferences',
};

// export const headers = {
//     'content-type': 'application/json',
// };

export const get = async (endPoint, token) => {
    try {
        const result = await Axios.get(endPoint, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return result;
    } catch (e) {
        throw errorHandler(e);
    }
};

export const destroy = async (endPoint, token) => {
    try {
        const result = await Axios.delete(endPoint, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return result;
    } catch (e) {
        throw errorHandler(e);
    }
};

export const post = async (endPoint, data, token, headers) => {
    try {
        const result = await Axios.post(endPoint, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers,
            },
        });
        return result;
    } catch (e) {
        throw errorHandler(e);
    }
};
export const patch = async (endPoint, data, token, headers) => {
    try {
        const result = await Axios.patch(endPoint, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers,
            },
        });
        return result;
    } catch (e) {
        throw errorHandler(e);
    }
};

export const postOTP = async (phoneNumber, code, hash) => {
    try {
        let updatedUrl = 'https://bsms.telecard.com.pk/SMSportal/Customer/apikey.aspx?apikey=1d07ca168f204b53bfb985f2dd6c2355&msg=Your verification code is ' + code + ' from Humsafar';
        if (hash) updatedUrl = updatedUrl + '  %0a%0a' + hash;
        updatedUrl = updatedUrl + '&mobileno=' + phoneNumber;
        const result = await AxiosBasic
            .post(updatedUrl);
        return result;
    } catch (e) {
        throw errorHandler(e);
    }
};
