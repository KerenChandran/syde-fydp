import { createAction } from 'redux-actions';
import * as UserConstants from './constants';

export const addLoginSuccess = createAction(UserConstants.LOGIN_USER, user => ({ user }));
export const editProfileSuccess = createAction(UserConstants.EDIT_PROFILE, profile => ({ profile }));

export const signUp = (user) => async dispatch => {
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
    console.log("Data: " + data);
    return dispatch(addLoginSuccess(data));
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
    console.log(data.token);
    return dispatch(addLoginSuccess(data));
  } catch (error) {
    throw new Error(error);
  }
};

export const editProfile = (profile) => async dispatch => {
  // TODO: also need to send in user token with this
  try {
    console.log(localStorage.getItem('id_token'));
    let response = await fetch('http://localhost:3000/api/edit_profile', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('id_token')
      },
      body: JSON.stringify({ profile: profile })
    });
    let data = await response.json();
    console.log("Data: " + data);
    return dispatch(editProfileSuccess(data));
  } catch (error) {
    throw new Error(error);
  }
};