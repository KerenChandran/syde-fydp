import * as RequestConstants from './constants';

const initialState = {
  incentive: {
    fee_amount: null,
    fee_cadence: null,
    incentive_type: null,
    new_incentive: false,
  },
  requests: []
};

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case RequestConstants.FETCH_REQUESTS: {
      return {
        ...state,
        requests: payload.request_data
      } 
    }

    case RequestConstants.SAVE_INCENTIVE: {
      return {
        ...state,
        incentive: payload.incentive
      }
    }

    case RequestConstants.CLEAR_INCENTIVE: {
      return {
        ...state,
        incentive: initialState.incentive
      }
    }

    case RequestConstants.CLEAR_REQUESTS: {
      return {
        ...state,
        requests: []
      }
    }

    default: {
      return state;
    }
  }
}