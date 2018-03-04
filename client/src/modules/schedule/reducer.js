import * as ScheduleConstants from './constants';
import moment from 'moment';

const initialState = {
  events: [],
  errors: [],
  availability_start: null,
  availability_end: null,
  filteredResources: []
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

    case ScheduleConstants.FETCH_SCHEDULE_RESOURCE_IDS: {
      return {
        ...state,
        filteredResources: payload.resourceInfo.resources
      };
    }

    case ScheduleConstants.CLEAR_SCHEDULE: {
      return initialState;
    }

    default:
      return state;
  }
}