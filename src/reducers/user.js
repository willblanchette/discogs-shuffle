
import { FETCH_USER, RECEIVE_USER, SET_USER } from '../actions/user'

export default function user(state = {}, action) {
  switch (action.type) {
    case FETCH_USER:
        return {
            ...state,
            fetching: true,
        };

    case RECEIVE_USER:
      return {
        ...state,
        ...action.user,
        fetching: false,
      };

    case SET_USER:
    default:
      return state;
  }
}