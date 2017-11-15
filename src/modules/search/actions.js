import { createAction } from 'redux-actions';
import * as SearchConstants from './constants';

export const submitSearch = createAction(SearchConstants.SUBMIT_SEARCH, search => ({ search }));