import * as UserConstants from './constants';

const initialState = {
  currentUser: {
    user: {},
    accounts: []
  },
  users: [{
    department: 'Systems Design Engineering',
    email: 'sid@unnithan.com',
    faculty: 'Engineering',
    first_name: 'Sid',
    id: 1,
    last_name: 'Unnithan',
    phone: '123',
    role: 'Operator'
  }]
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

      case UserConstants.FETCH_USERS: {
        return {
          ...state,
          users: payload.all_users
        };
      }

      case UserConstants.FETCH_USER: {
        const { users } = state;
        if (!users.length) {
          return {
            ...state,
            users: [payload.user]
          }
        }
  
        let idx = -1;
        const res = payload.user;
  
        users.find((user, index) => {
          if (user.id === res.id) {
            idx = index;
            return true;
          }
          return false;
        });
  
        const newUsers = [
          ...users.slice(0, idx),
          res,
          ...users.slice(idx + 1)
        ];
  
        return {
          ...state,
          users: newUsers
        };
      }

    default:
      return state;
  }
}