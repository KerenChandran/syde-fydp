import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './modules/reducer';

export default (initialState) => (
  createStore(rootReducer, initialState, applyMiddleware(thunk)
  )
);
