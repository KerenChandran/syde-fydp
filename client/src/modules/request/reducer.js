import * as RequestConstants from './constants';

const initialState = {
  fee_amount: null,
  fee_cadence: null,
  incentive_type: null,
  new_incentive: false
};

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case RequestConstants.SAVE_REQUEST: {
      return {
        ...state,
        ...payload.request
      }
    }

    case RequestConstants.CLEAR_REQUEST: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}