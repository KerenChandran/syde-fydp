import { combineReducers } from 'redux';

//Reducers
import { resourceReducer as resources } from './resources';
import { searchReducer as search } from './search';
import { userReducer as users } from './users';

export default combineReducers({
  resources,
  search,
  users
});
