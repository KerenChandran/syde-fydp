import { createSelector } from 'reselect';
import { currentUserId } from '../users/selectors';

export const resources = (state) => state.resources.resources;
export const userResources = (resources, userId) => (
  resources.filter(resource => resource.ownerId === userId)
);

export const currentUserResources = createSelector(resources, currentUserId, userResources);

export const showBulkImport = state => state.resources.showBulkImport;
export const showDataImport = state => state.resources.showDataImport;