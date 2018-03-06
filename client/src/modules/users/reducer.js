import * as UserConstants from './constants';

const initialState = {
  currentUser: {"user": {}}
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
      case UserConstants.LOGIN_USER: {
        let currentUser = payload.user;
        return {
            ...state, currentUser
        };
      };

      case UserConstants.EDIT_PROFILE: {
        let currentUser = payload.profile;
        return {
            ...state, currentUser
        };
      };

    default:
      return state;
  }
}