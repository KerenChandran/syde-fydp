import { createSelector } from 'reselect';
import { currentUserId } from '../users/selectors';

export const resources = (state) => state.resources;
export const userResources = (resources, userId) => (
  resources.filter(resource => resource.ownerId === userId)
);

export const currentUserResources = createSelector(resources, currentUserId, userResources);