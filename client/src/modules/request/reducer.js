import * as RequestConstants from './constants';

const initialState = {
  incentive: {
    fee_amount: null,
    fee_cadence: null,
    incentive_type: null,
    new_incentive: false,
  },
  requests: [],
  fee_total: 0
};

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case RequestConstants.FETCH_REQUESTS: {
      return {
        ...state,
        requests: payload.request_data
      } 
    }

    case RequestConstants.FETCH_REQUEST_TOTAL: {
      return {
        ...state,
        fee_total: parseFloat(payload.transfer_amount)
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

    case RequestConstants.CLEAR_REQUEST_TOTAL: {
      return {
        ...state,
        fee_total: 0
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