import { combineReducers } from 'redux';

//Reducers
import { resourceReducer as resources } from './resources';
import { searchReducer as search } from './search';
import { userReducer as users } from './users';
import { notificationReducer as notifications } from './notifications';

export default combineReducers({
  resources,
  search,
  users,
  notifications
});
