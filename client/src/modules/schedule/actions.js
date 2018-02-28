import { createAction } from 'redux-actions';
import * as ScheduleConstants from './constants';

export const fetchScheduleBlocksSuccess = createAction(ScheduleConstants.FETCH_SCHEDULE, schedule => ({ schedule }));
export const validateRequestBlocksSuccess = createAction(ScheduleConstants.VALIDATE_BLOCKS, schedule => ({ schedule }));

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
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resource_list: [id] })
    });
    let data = await response.json();
    return dispatch(fetchScheduleBlocksSuccess(data));
}

export const submitScheduleBlock = (block) => async dispatch => {
  try {
    let response = await fetch('http://localhost:3000/api/submit_schedule_blocks', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([block])
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
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(block)
    });
    let data = await response.json();
    return dispatch(validateRequestBlocksSuccess(data));
  } catch (error) {
    throw new Error(error);
  }
};