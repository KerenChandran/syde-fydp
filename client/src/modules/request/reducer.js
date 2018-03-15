import * as RequestConstants from './constants';

const initialState = {
  incentive: {
    fee_amount: null,
    fee_cadence: null,
    incentive_type: null,
    new_incentive: false,
  },
  requests: [],
  submitted_requests: [],
  fee_total: 0
};

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case RequestConstants.FETCH_REQUESTS: {
      return {
        ...state,
        requests: payload.owned_requests,
        submitted_requests: payload.submitted_requests
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
        requests: [],
        submitted_requests: []
      }
    }

    default: {
      return state;
    }
  }
}