
import { FETCH_LIBRARY, RECEIVE_LIBRARY } from '../actions/library'

export default function library(state = {}, action) {
  switch (action.type) {
    case FETCH_LIBRARY:
        return {
            ...state,
            fetching: true
        };

    case RECEIVE_LIBRARY:
      return {
        ...state,
        ...action.library,
        fetching: false
      };

    default:
      return {
        ...state,
        fetching: true
      };
  }
}