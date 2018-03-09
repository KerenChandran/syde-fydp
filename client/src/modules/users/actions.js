import { push } from 'react-router-redux';
import { createAction } from 'redux-actions';

import * as UserConstants from './constants';
import ApiHeaders from '../api/headers';

export const addLoginSuccess = createAction(UserConstants.LOGIN_USER, user => ({ user }));
export const editProfileSuccess = createAction(UserConstants.EDIT_PROFILE, profile => ({ profile }));
export const fetchAccountsSuccess = createAction(UserConstants.FETCH_ACCOUNTS, accounts => accounts);

export const signUp = (user, history) => async dispatch => {
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
    let response = await fetch('http://localhost:3000/api/login', {
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
    response = await fetch('http://localhost:3000/api/get_accounts', {
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
    let response = await fetch('http://localhost:3000/api/edit_profile', {
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
    let response = await fetch('http://localhost:3000/api/auth_user', {
      method: 'post',
      headers: ApiHeaders()
    });
    let data = await response.json();
    dispatch(editProfileSuccess(data));
  } catch (error) {
    localStorage.removeItem('id_token');
    throw new Error(error);
  }
};

export const logout = () => async dispatch => {
  localStorage.removeItem('id_token');
  dispatch(push('/'));
};