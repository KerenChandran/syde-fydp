import { createAction } from "redux-actions";
import * as RequestConstants from './constants';
import ApiHeaders from '../api/headers';

export const saveIncentive = createAction(RequestConstants.SAVE_INCENTIVE, incentive => ({ incentive }));
export const clearIncentive = createAction(RequestConstants.CLEAR_INCENTIVE);
export const clearRequests = createAction(RequestConstants.CLEAR_REQUESTS);
export const fetchRequestsSuccess = createAction(RequestConstants.FETCH_REQUESTS, request => request);

export const fetchRequests = owner_id => async dispatch => {
  try {
    let response = await fetch('http://localhost:3000/api/get_requests', {
      method: 'post',
      headers: ApiHeaders(),
      body: JSON.stringify({ owner_id })
    });
    let data = await response.json();
    dispatch(fetchRequestsSuccess(data));
  } catch (error) {
    throw new Error(error);
  }
}


export const submitRequest = request => async dispatch => {
  try {
    let response = await fetch('http://localhost:3000/api/submit_request', {
      method: 'post',
      headers: ApiHeaders(),
      body: JSON.stringify(request)
    });
    let data = await response.json();
    console.log('yes', data);
  } catch (error) {
    throw new Error(error);
  }
}