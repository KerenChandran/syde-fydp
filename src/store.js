import { createStore } from 'redux';
import rootReducer from './modules/reducer';

export default (initialState) => (
  createStore(rootReducer, initialState)
);
