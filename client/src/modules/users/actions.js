import { push } from 'react-router-redux';
import { createAction } from 'redux-actions';

import * as UserConstants from './constants';
import ApiHeaders from '../api/headers';
import BASE_URL from '../api/url';

export const addLoginSuccess = createAction(UserConstants.LOGIN_USER, user => ({ user }));
export const editProfileSuccess = createAction(UserConstants.EDIT_PROFILE, profile => ({ profile }));
export const fetchAccountsSuccess = createAction(UserConstants.FETCH_ACCOUNTS, accounts => accounts);
export const fetchUsersSuccess = createAction(UserConstants.FETCH_USERS, users => users)
export const fetchUserSuccess = createAction(UserConstants.FETCH_USER, user => user);

export const signUp = user => async dispatch => {
  try {
    let response = await fetch('http://localhost:3000/api/new_user', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: user })
    });
    let data = await response.json();
    localStorage.setItem('id_token', data.token);
    dispatch(addLoginSuccess(data));
    dispatch(push('/profile/edit'));
  } catch (error) {
    throw new Error(error);
  }
};

export const login = (user) => async dispatch => {
  try {
    let response = await fetch(BASE_URL + '/login', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: user })
    });
    let data = await response.json();
    localStorage.setItem('id_token', data.token);
    dispatch(addLoginSuccess(data));
    response = await fetch(BASE_URL + '/get_accounts', {
      method: 'get',
      headers: ApiHeaders()
    });
    data = await response.json();
    console.log('accounts data', data);
    dispatch(fetchAccountsSuccess(data));
    dispatch(push('/resources'));
  } catch (error) {
    throw new Error(error);
  }
};

export const editProfile = (profile) => async dispatch => {
  try {
    let response = await fetch(BASE_URL + '/edit_profile', {
      method: 'post',
      headers: ApiHeaders(),
      body: JSON.stringify({ profile: profile })
    });
    let data = await response.json();
    dispatch(editProfileSuccess(data));
    dispatch(push('/resources'));
  } catch (error) {
    throw new Error(error);
  }
};

export const authUser = () => async dispatch => {
  try {
    let response = await fetch(BASE_URL + '/auth_user', {
      method: 'post',
      headers: ApiHeaders()
    });
    let data = await response.json();
    return dispatch(editProfileSuccess(data));
  } catch (error) {
    localStorage.removeItem('id_token');
    throw new Error(error);
  }
};

export const logout = () => async dispatch => {
  localStorage.removeItem('id_token');
  dispatch(push('/'));
};

export const fetchUser = user_id => async dispatch => {
  try {
    let response = await fetch(BASE_URL + '/fetch_user_by_id', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id })
    });
    let data = await response.json();
    dispatch(fetchUserSuccess(data));
    return data.user;
  } catch (error) {
    throw new Error(error);
  }
}

export const fetchUsers = () => async dispatch => {
  try {
    let response = await fetch(BASE_URL + `/fetch_all_users`, {
      method: 'get',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    });
    let data = await response.json();
    dispatch(fetchUsersSuccess(data));
    return data;
  } catch (error) {
    throw new Error(error);
  }
}