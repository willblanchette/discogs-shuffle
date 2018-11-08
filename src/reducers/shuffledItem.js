import { FETCH_SHUFFLED_ITEM, RECEIVE_SHUFFLED_ITEM } from '../actions/shuffledItem'

export default function shuffledItem(state = {}, action) {
  switch (action.type) {
    case RECEIVE_SHUFFLED_ITEM:
      return {
        ...state,
        ...action.shuffledItem
      }

    case FETCH_SHUFFLED_ITEM:
    default:
      return {
        ...state,
      };
  }
}