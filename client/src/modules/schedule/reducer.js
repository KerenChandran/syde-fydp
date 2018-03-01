import * as ScheduleConstants from './constants';
import moment from 'moment';

const initialState = {
  events: [],
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
      const { events, ...others } = state;
      const newEvents = [
        ...events,
        ...payload.schedule.final_blocks
      ];
      return {
        ...others,
        events: newEvents,
        errors: payload.schedule.errors        
      };
    }

    default:
      return state;
  }
}