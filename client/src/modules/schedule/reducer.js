import * as ScheduleConstants from './constants';
import moment from 'moment';

const initialState = {
  events: [],
  requestedEvents: [],
  errors: [],
  availability_start: null,
  availability_end: null
};

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case ScheduleConstants.FETCH_SCHEDULE: {
      const { availability_end, availability_start, block_list } = payload.schedule.resource_data[0];
      return {
        ...state,
        events: block_list || [],
        availability_end: moment(availability_end),
        availability_start: moment(availability_start)
      };
    }

    case ScheduleConstants.VALIDATE_BLOCKS: {
      const { requestedEvents, ...others } = state;
      const newRequestedEvents = [
        ...requestedEvents,
        ...payload.schedule.final_blocks
      ];
      return {
        ...others,
        requestedEvents: newRequestedEvents,
        errors: payload.schedule.errors        
      };
    }

    case ScheduleConstants.DELETE_EVENT: {
      const { requestedEvents, ...others } = state;
      return {
        requestedEvents: requestedEvents.filter((event, idx) => idx != payload.idx),
        ...others
      };
    }

    case ScheduleConstants.CLEAR_SCHEDULE: {
      return initialState;
    }

    default:
      return state;
  }
}