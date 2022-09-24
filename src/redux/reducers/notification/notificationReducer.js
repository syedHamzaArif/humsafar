import * as actionTypes from '../../actions/actionTypes';

let empty = {
    unread: 0,
    notifications: [],
};

let notification = {
    unread: 0,
    notifications: [],
};

export default function reducer(state = notification, action) {
    switch (action.type) {
        case actionTypes.ADD_NOTIFICATION_DATA:
            return action.data;
        case actionTypes.UPDATE_NOTIFICATION_DATA:
            return {
                ...state,
                [action.data.name]: action.data.value,
            };
        case actionTypes.CLEAR_NOTIFICATION_DATA:
            return empty;
        default:
            return state;
    }
}
