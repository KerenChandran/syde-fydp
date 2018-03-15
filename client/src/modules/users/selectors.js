import { getResource } from '../resources/selectors';
import { getRequest } from '../request/selectors';
export const currentUserId = state => state.users.currentUser.user.id;
export const currentUser = state => state.users.currentUser.user;
export const currentUserAccounts = state => state.users.currentUser.accounts;
export const currentUserTargetAccounts = state => (
  state.users.currentUser.accounts.filter(account => account.type === 'operational')
);

export const getAllUsers = state => state.users.users;
export const getOwnerByResource = (state, resourceId) => {
  const resource = getResource(state, resourceId);
  return resource ? getUser(getAllUsers(state), resource.ownerid) : null;
}

export const getOwnerByRequest = (state, requestId) => {
  const request = getRequest(state, requestId);
  return request ? getUser(getAllUsers(state), request.ownerid) : null;
}

export const getRequesterByRequest = (state, requestId) => {
  const request = getRequest(state, requestId);
  return request ? getUser(getAllUsers(state), request.requester_id) : null;
}

export const getUser = (users, id) => users.find(user => user.id == id);