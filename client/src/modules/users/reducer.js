import * as UserConstants from './constants';

const initialState = {
  currentUser: {
    user: {},
    accounts: []
  }
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
      case UserConstants.LOGIN_USER: {
        let currentUser = {
          ...state.currentUser,
          ...payload.user
        };
        return {
            ...state, currentUser
        };
      };

      case UserConstants.EDIT_PROFILE: {
        let currentUser = {
          ...state.currentUser,
          ...payload.profile
        };
        return {
            ...state, currentUser
        };
      };

      case UserConstants.FETCH_ACCOUNTS: {
        let currentUser = {
          ...state.currentUser,
          accounts: payload.account_information
        };

        return {
          ...state, currentUser
        };
      }

    default:
      return state;
  }
}