import * as SearchConstants from './constants';

const initialState = {
  searchText: '',
  available: null,
  mobile: null,
  incentive: null,
  fees: null,
  feesRange: '='
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SearchConstants.SUBMIT_SEARCH: {
      return {
        ...state,
        ...payload.search
      };
    }
    case SearchConstants.RESET_SEARCH: {
      return initialState;
    }
    default:
      return state;
  }
}