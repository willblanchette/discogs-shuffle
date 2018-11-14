
import { FETCH_USER, RECEIVE_USER } from '../actions/user'

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
        username: action.user ? action.user.username : undefined,
        fetching: false,
      };

    default:
      return state;
  }
}