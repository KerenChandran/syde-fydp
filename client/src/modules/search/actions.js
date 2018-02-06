import { createAction } from 'redux-actions';
import * as SearchConstants from './constants';

export const resetSearch = createAction(SearchConstants.RESET_SEARCH); 
export const submitResourceSearch = createAction(SearchConstants.SUBMIT_RESOURCE_SEARCH, search => ({ search }));