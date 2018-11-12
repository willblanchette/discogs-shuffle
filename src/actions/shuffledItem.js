import * as api from '../utils/api'

export const FETCH_SHUFFLED_ITEM = 'FETCH_SHUFFLED_ITEM';
export const RECEIVE_SHUFFLED_ITEM = 'RECEIVE_SHUFFLED_ITEM';

function fetchShuffledItem() {
    return {
        type: FETCH_SHUFFLED_ITEM
    };
}


export function handleFetchShuffledItem(username, format) {
    return dispatch => {
        dispatch(fetchShuffledItem());
        api.fetchShuffledItem(username, format)
            .then(shuffledItem => {
                dispatch(receiveShuffledItem(shuffledItem));
            });
    }
}

function receiveShuffledItem(shuffledItem) {
    return {
        type: RECEIVE_SHUFFLED_ITEM,
        shuffledItem
    };
}

export function handleSkip(release) {
    return dispatch => {
        api.skipItem(release);
    }
}