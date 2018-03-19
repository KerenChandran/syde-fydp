import { createAction } from "redux-actions";
import * as RequestConstants from './constants';
import ApiHeaders from '../api/headers';
import { push } from 'react-router-redux';
import moment from 'moment';
import BASE_URL from '../api/url';

export const saveIncentive = createAction(RequestConstants.SAVE_INCENTIVE, incentive => ({ incentive }));
export const clearIncentive = createAction(RequestConstants.CLEAR_INCENTIVE);
export const clearRequests = createAction(RequestConstants.CLEAR_REQUESTS);
export const fetchRequestsSuccess = createAction(RequestConstants.FETCH_REQUESTS, request => request);

export const fetchRequestTotalSuccess = createAction(RequestConstants.FETCH_REQUEST_TOTAL, total => total);
export const clearRequestTotal = createAction(RequestConstants.CLEAR_REQUEST_TOTAL);

export const fetchRequests = owner_id => async dispatch => {
  try {
    let response = await fetch(BASE_URL + '/get_requests', {
      method: 'post',
      headers: ApiHeaders(),
      body: JSON.stringify({ owner_id })
    });
    let data = await response.json();
    dispatch(fetchRequestsSuccess(data));
    return data;
  } catch (error) {
    throw new Error(error);
  }
}


export const submitRequest = request => async dispatch => {
  try {
    let response = await fetch(BASE_URL + '/submit_request', {
      method: 'post',
      headers: ApiHeaders(),
      body: JSON.stringify(request)
    });
    let data = await response.json();
    data.success ? dispatch(push('/resources')) : null;
  } catch (error) {
    throw new Error(error);
  }
}

export const acceptRequest = request => async dispatch => {
  try {
    let response = await fetch(BASE_URL + '/accept_request', {
      method: 'post',
      headers: ApiHeaders(),
      body: JSON.stringify(request)
    });
    let data = await response.json();
    data.success ? dispatch(push('/requests')) : null;
  } catch (error) {
    throw new Error(error);
  }
}

export const rejectRequest = request => async dispatch => {
  try {
    let response = await fetch(BASE_URL + '/reject_request', {
      method: 'post',
      headers: ApiHeaders(),
      body: JSON.stringify(request)
    });
    let data = await response.json();
    data.success ? dispatch(push('/requests')) : null;
  } catch (error) {
    throw new Error(error);
  }
}

export const fetchRequestTotal = (fee_amount, fee_cadence, block_list) => async dispatch => {
  try {
    let response = await fetch(BASE_URL + '/api/get_transfer_amount', {
      method: 'post',
      headers: ApiHeaders(),
      body: JSON.stringify({
        fee_cadence,
        fee_amount,
        block_list: block_list.map(event => ({
          block_start: moment(event.block_start).format('YYYY-MM-DD HH:mm'),
          block_end: moment(event.block_end).format('YYYY-MM-DD HH:mm')
        }))
      })
    });
    let data = await response.json();
    dispatch(fetchRequestTotalSuccess(data))
    return data;
  } catch (error) {
    throw new Error(error);
  }
}