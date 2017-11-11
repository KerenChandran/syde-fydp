import { combineReducers } from 'redux';

//Reducers
import { resourceReducer as resources } from './resources';
import { userReducer as users } from './users';

export default combineReducers({
  resources,
  users
});
