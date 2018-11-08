import * as api from '../utils/api';

export const FETCH_USER = 'FETCH_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const SET_USER = 'SET_USER';

function fetchUser() {
    return {
        type: FETCH_USER,
    };
}

export function handleFetchUser() {
    return dispatch => {
        dispatch(fetchUser());
        api.fetchUser()
            .then(user => {
                dispatch(receiveUser(user));
            });
    };
}

function receiveUser(user) {
    return {
        type: RECEIVE_USER,
        user,
    };
}

function setUser() {
    return {
        type: SET_USER,
    };
}

export function handleSetUser(user) {
    return dispatch => {
        dispatch(setUser());
        api.setUser(user);
        dispatch(handleFetchUser());
    }
}