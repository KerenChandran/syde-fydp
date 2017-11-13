import { createAction } from 'redux-actions';
import * as ResourceActions from './constants';

// Create Form Actions
export const toggleBulkImportForm = createAction(ResourceActions.TOGGLE_BULK_IMPORT_FORM);
export const toggleDataImportForm = createAction(ResourceActions.TOGGLE_DATA_IMPORT_FORM);

// Add to Database
export const addBulkImport = createAction(ResourceActions.ADD_BULK_IMPORT);
export const addDataImport = createAction(ResourceActions.ADD_DATA_IMPORT);