import * as api from '../utils/api'

export const FETCH_LIBRARY = 'FETCH_LIBRARY'
export const RECEIVE_LIBRARY = 'RECEIVE_LIBRARY'

function fetchLibrary() {
    return {
        type: FETCH_LIBRARY
    };
}

export function handleFetchLibrary(username, forceRefresh) {
    return dispatch => {
        dispatch(fetchLibrary(username));
        api.fetchLibrary(username, forceRefresh)
            .then(library => {
                dispatch(receiveLibrary(library));
            });
    };
}

function receiveLibrary(library) {
    return {
        type: RECEIVE_LIBRARY,
        library
    };
}

export function handleClearLibrary() {
    return dispatch => {
        api.clearLibrary();
        dispatch(receiveLibrary(undefined));
    };
}