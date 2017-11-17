import { createAction } from 'redux-actions';
import * as SearchConstants from './constants';

export const resetSearch = createAction(SearchConstants.RESET_SEARCH); 
export const submitSearch = createAction(SearchConstants.SUBMIT_SEARCH, search => ({ search }));