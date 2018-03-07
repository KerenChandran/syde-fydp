import { createAction } from "redux-actions";
import * as RequestConstants from './constants';
import ApiHeaders from '../api/headers';

export const saveRequest = createAction(RequestConstants.SAVE_REQUEST, request => ({ request }));
export const clearRequest = createAction(RequestConstants.CLEAR_REQUEST);

export const submitRequest = request => async dispatch => {
  try {
    let response = await fetch('http://localhost:3000/api/submit_request', {
      method: 'post',
      headers: ApiHeaders,
      body: JSON.stringify(request)
    });
    let data = await response.json();
    console.log('yes', data);
  } catch (error) {
    throw new Error(error);
  }
}