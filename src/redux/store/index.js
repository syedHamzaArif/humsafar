import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import userReducer from '../reducers/user/userReducer';
import notificationReducer from '../reducers/notification/notificationReducer';
import rideReducer from '../reducers/ride/rideReducer';

const AppReducer = combineReducers({
    userReducer, notificationReducer, rideReducer,
});

const logger = (store) => {
    return (next) => {
        return (action) => {
            const result = next(action);
            // console.log('[Middleware] next state =>', store.getState());
            return result;
        };
    };
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    AppReducer,
    composeEnhancers(applyMiddleware(logger)),
);

export default store;
