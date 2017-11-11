import data from './data.json';
import * as ResourceConstants from './constants';

const initialState = data.resources;

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case ResourceConstants.ADD_BULK_IMPORT:
      return {
        ...state,
        ...payload
      };
    case ResourceConstants.ADD_DATA_IMPORT:
      return {
        ...state,
        payload
      };
    default:
      return state;
  }
}