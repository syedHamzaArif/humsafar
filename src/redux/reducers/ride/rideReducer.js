import * as actionTypes from '../../actions/actionTypes';

let empty = {
    status: null,
    ride: {},
};

let ride = {
    status: null,
    ride: {},
};

export default function reducer(state = ride, action) {
    switch (action.type) {
        case actionTypes.ADD_RIDE_DATA:
            return action.data;
        case actionTypes.UPDATE_RIDE_DATA:
            return {
                ...state,
                [action.data.name]: action.data.value,
            };
        case actionTypes.CLEAR_RIDE_DATA:
            return empty;
        default:
            return state;
    }
}
