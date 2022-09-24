import * as actionTypes from '../../actions/actionTypes';

let empty = {
    userData: {},
};
let user = {};

export default function reducer(state = user, action) {
    switch (action.type) {
        case actionTypes.ADD_USER_DATA:
            return action.data;
        case actionTypes.UPDATE_DATA:
            return {
                ...state,
                [action.data.name]: action.data.value,
            };
        case actionTypes.CLEAR_USER_DATA:
            return empty;
        default:
            return state;
    }
}
