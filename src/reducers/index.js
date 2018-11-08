import { combineReducers } from 'redux';
import library from './library';
import user from './user';

export default combineReducers({
  library,
  user,
})