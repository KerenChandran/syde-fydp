import { createAction } from 'redux-actions';
import * as ResourceActions from './constants';

// Create Form Actions
export const createBulkImport = createAction(ResourceActions.CREATE_BULK_IMPORT);
export const createDataImport = createAction(ResourceActions.CREATE_DATA_IMPORT);

// Add to Database
export const addBulkImport = createAction(ResourceActions.ADD_BULK_IMPORT);
export const addDataImport = createAction(ResourceActions.ADD_DATA_IMPORT);