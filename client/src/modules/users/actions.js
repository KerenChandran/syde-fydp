import { createAction } from 'redux-actions';
import * as UserConstants from './constants';

export const addSignUpSuccess = createAction(UserConstants.ADD_NEW_USER, user => ({ user }));

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
    return dispatch(addSignUpSuccess(data));
  } catch (error) {
    throw new Error(error);
  }
};