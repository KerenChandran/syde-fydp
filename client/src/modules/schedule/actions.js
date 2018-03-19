import { createAction } from 'redux-actions';
import * as ScheduleConstants from './constants';
import ApiHeaders from '../api/headers';
import { push } from 'react-router-redux';
import moment from 'moment';
import BASE_URL from '../api/url';

export const fetchScheduleBlocksSuccess = createAction(ScheduleConstants.FETCH_SCHEDULE, schedule => ({ schedule }));
export const validateRequestBlocksSuccess = createAction(ScheduleConstants.VALIDATE_BLOCKS, schedule => ({ schedule }));
export const deleteRequestedEvent = createAction(ScheduleConstants.DELETE_EVENT, idx => ({ idx }));

export const saveAvailableEventSuccess = createAction(ScheduleConstants.SAVE_AVAILABLE_EVENT, events => ({ events }));
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
  let response = await fetch(BASE_URL + '/get_resource_schedules', {
    method: 'post',
    headers: ApiHeaders(),
    body: JSON.stringify({ resource_list: [id] })
  });
  let data = await response.json();
  return dispatch(fetchScheduleBlocksSuccess(data.resource_data[id]));
}

export const submitScheduleBlock = (block) => async dispatch => {
  try {
    let response = await fetch(BASE_URL + '/submit_schedule_blocks', {
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
    let response = await fetch(BASE_URL + '/validate_request_block', {
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
    let response = await fetch(BASE_URL + '/submit_availability_blocks', {
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

export const saveAvailableEvent = (existing_blocks, event, user_id) => async dispatch => {
  try {
    let response = await fetch(BASE_URL + '/submit_intermediate_availability_blocks', {
      method: 'post',
      headers: ApiHeaders(),
      body: JSON.stringify({
        existing_blocks: existing_blocks.map(event => ({
          block_start: moment(event.block_start).format('YYYY-MM-DD HH:mm'),
          block_end: moment(event.block_end).format('YYYY-MM-DD HH:mm')
        })),
        new_block_start: event.block_start,
        new_block_end: event.block_end,
        new_block_recurring: event.block_recurring
      })
    });
    let data = await response.json();
    return dispatch(saveAvailableEventSuccess(data.new_blocks.map(event => ({ ...event, user_id, block_recurring: {}}))));
  } catch (error) {
    throw new Error(error);
  }
}
