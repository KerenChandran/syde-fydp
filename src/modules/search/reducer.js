import * as SearchConstants from './constants';

const initialState = {
  searchText: '',
  available: null,
  location: null,
  faculty: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SearchConstants.SUBMIT_SEARCH: {
      return {
        ...state,
        ...payload.search
      };
    }
    default:
      return state;
  }
}