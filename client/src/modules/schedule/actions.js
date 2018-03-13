import { createAction } from 'redux-actions';
import * as ScheduleConstants from './constants';
import ApiHeaders from '../api/headers';
import { push } from 'react-router-redux';

export const fetchScheduleBlocksSuccess = createAction(ScheduleConstants.FETCH_SCHEDULE, schedule => ({ schedule }));
export const validateRequestBlocksSuccess = createAction(ScheduleConstants.VALIDATE_BLOCKS, schedule => ({ schedule }));
export const deleteRequestedEvent = createAction(ScheduleConstants.DELETE_EVENT, idx => ({ idx }));

export const saveAvailableEvent = createAction(ScheduleConstants.SAVE_AVAILABLE_EVENT, event => ({ event }));
export const clearAvailableEvents = createAction(ScheduleConstants.CLEAR_AVAILABLE_EVENTS);
export const deleteAvailableEvent = createAction(ScheduleConstants.DELETE_AVAILABLE_EVENT, idx => ({ idx }));


export const clearEvents = createAction(ScheduleConstants.CLEAR_EVENTS);
export const clearSchedule = createAction(ScheduleConstants.CLEAR_SCHEDULE);

export const fetchResourceSchedule = id => async dispatch => {
  try {
    return fetchResourceScheduleHelper(id, dispatch);
  } catch (error) {
    throw new Error(error);
  }
}

export const fetchResourceScheduleHelper = async (id, dispatch) => {
  let response = await fetch('http://localhost:3000/api/get_resource_schedules', {
    method: 'post',
    headers: ApiHeaders(),
    body: JSON.stringify({ resource_list: [id] })
  });
  let data = await response.json();
  return dispatch(fetchScheduleBlocksSuccess(data));
}

export const submitScheduleBlock = (block) => async dispatch => {
  try {
    let response = await fetch('http://localhost:3000/api/submit_schedule_blocks', {
      method: 'post',
      headers: ApiHeaders(),
      body: JSON.stringify(block)
    });
    let data = await response.json();
    return fetchResourceScheduleHelper(block.resource_id, dispatch);
  } catch (error) {
    throw new Error(error);
  }
};

export const validateRequestBlocks = (block) => async dispatch => {
  try {
    let response = await fetch('http://localhost:3000/api/validate_request_block', {
      method: 'post',
      headers: ApiHeaders(),
      body: JSON.stringify(block)
    });
    let data = await response.json();
    return dispatch(validateRequestBlocksSuccess(data));
  } catch (error) {
    throw new Error(error);
  }
};

export const submitAvailabilityBlocks = blocks => async dispatch => {
  try {
    let response = await fetch('http://localhost:3000/api/submit_availability_blocks', {
      method: 'post',
      headers: ApiHeaders(),
      body: JSON.stringify(blocks)
    });
    let data = await response.json();
    return dispatch(push('/resources'));
  } catch (error) {
    throw new Error(error);
  }
}
