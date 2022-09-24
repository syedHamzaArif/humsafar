import * as actionTypes from './actionTypes';

export function adduserdata(data) {
    return {
        type: actionTypes.ADD_USER_DATA,
        data,
    };
}
export function updatedata(data) {
    return {
        type: actionTypes.UPDATE_DATA,
        data,
    };
}
export function clearuserdata() {
    return {
        type: actionTypes.CLEAR_USER_DATA,
    };
}
export function clearuserdetails() {
    return {
        type: actionTypes.CLEAR_USER_DETAILS,
    };
}
export function addnotificationdata(data) {
    return {
        type: actionTypes.ADD_NOTIFICATION_DATA,
        data,
    };
}
export function clearnotificationdata() {
    return {
        type: actionTypes.CLEAR_NOTIFICATION_DATA,
    };
}
export function updatenotificationdata(data) {
    return {
        type: actionTypes.UPDATE_NOTIFICATION_DATA,
        data,
    };
}

export function addridedata(data) {
    return {
        type: actionTypes.ADD_RIDE_DATA,
        data,
    };
}
export function clearridedata() {
    return {
        type: actionTypes.CLEAR_RIDE_DATA,
    };
}
export function updateridedata(data) {
    return {
        type: actionTypes.UPDATE_RIDE_DATA,
        data,
    };
}
