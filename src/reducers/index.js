import { combineReducers } from 'redux';
import library from './library';
import user from './user';
import shuffledItem from './shuffledItem';

export default combineReducers({
  library,
  user,
  shuffledItem
});