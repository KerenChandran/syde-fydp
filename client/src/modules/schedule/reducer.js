import * as ScheduleConstants from './constants';
import moment from 'moment';

const initialState = {
  events: [],
  requestedEvents: [],
  availableEvents: [],
  errors: [],
  availability_start: null,
  availability_end: null
};

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case ScheduleConstants.FETCH_SCHEDULE: {
      const { block_list } = payload.schedule.resource_data[0];
      return {
        ...state,
        events: block_list || []
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

    case ScheduleConstants.SAVE_AVAILABLE_EVENT: {
      return {
        ...state,
        availableEvents: [
          ...state.availableEvents,
          payload.event
        ]
      };
    }

    case ScheduleConstants.DELETE_AVAILABLE_EVENT: {
      const { availableEvents, ...others } = state;
      return {
        availableEvents: availableEvents.filter((event, idx) => idx != payload.idx),
        ...others
      };
    }

    case ScheduleConstants.CLEAR_AVAILABLE_EVENTS: {
      return {
        ...state,
        availableEvents: []
      };
    }

    case ScheduleConstants.CLEAR_EVENTS: {
      return {
        ...state,
        events: []
      }
    }

    default:
      return state;
  }
}