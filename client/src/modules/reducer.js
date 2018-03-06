import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

//Reducers
import { resourceReducer as resources } from './resources';
import { scheduleReducer as schedule } from './schedule';
import { searchReducer as search } from './search';
import { userReducer as users } from './users';

export default combineReducers({
  resources,
  schedule,
  search,
  users,
  router: routerReducer
});
