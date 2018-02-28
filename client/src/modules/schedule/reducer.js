import * as ScheduleConstants from './constants';

const initialState = {
  events: [],
  errors: []
};

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case ScheduleConstants.FETCH_SCHEDULE: {
      return {
        ...state,
        events: payload.schedule.resource_data
      };
    }

    case ScheduleConstants.VALIDATE_BLOCKS: {
      const { events, ...others } = state;
      const newEvents = {
        ...events,
        ...payload.schedule.final_blocks
      };
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