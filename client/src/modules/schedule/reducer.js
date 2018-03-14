import * as ScheduleConstants from './constants';
import moment from 'moment';

const initialState = {
  requestedEvents: [],
  newRequestedEvents: [],
  availableEvents: [],
  errors: [],
  newAvailableEvents: []
};

export default (state = initialState, { type, payload }) => {
  switch(type) {
    case ScheduleConstants.FETCH_SCHEDULE: {
      const { availability_blocks, usage_blocks } = payload.schedule;
      return {
        ...state,
        requestedEvents: usage_blocks || [],
        availableEvents: availability_blocks || []
      };
    }

    case ScheduleConstants.VALIDATE_BLOCKS: {
      const { newRequestedEvents, ...others } = state;
      return {
        ...others,
        newRequestedEvents: [
          ...newRequestedEvents,
          ...payload.schedule.final_blocks
        ],
        errors: payload.schedule.errors        
      };
    }

    case ScheduleConstants.DELETE_EVENT: {
      const { newRequestedEvents, ...others } = state;
      return {
        newRequestedEvents: newRequestedEvents.filter((event, idx) => idx != payload.idx),
        ...others
      };
    }

    case ScheduleConstants.CLEAR_SCHEDULE: {
      return initialState;
    }

    case ScheduleConstants.SAVE_AVAILABLE_EVENT: {
      return {
        ...state,
        newAvailableEvents: [
          ...state.newAvailableEvents,
          payload.event
        ]
      };
    }

    case ScheduleConstants.DELETE_AVAILABLE_EVENT: {
      const { newAvailableEvents, ...others } = state;
      return {
        newAvailableEvents: newAvailableEvents.filter((event, idx) => idx != payload.idx),
        ...others
      };
    }

    case ScheduleConstants.CLEAR_AVAILABLE_EVENTS: {
      return {
        ...state,
        newAvailableEvents: [],
        availableEvents: []
      };
    }

    case ScheduleConstants.CLEAR_EVENTS: {
      return {
        ...state,
        requestedEvents: [],
        newRequestedEvents: [],
        availableEvents: [],
        newAvailableEvents: [],
      }
    }

    default:
      return state;
  }
}