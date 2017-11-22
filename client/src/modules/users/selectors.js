export const currentUserId = state => state.users.currentUserId;
export const currentUser = state => state.users.users.find(user => user.id === state.users.currentUserId);
export const usersSelector = state => state.users.users;
