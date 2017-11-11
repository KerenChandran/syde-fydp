const initialState = {
  users: [{
    id: 1,
    name: 'John',
    phone: '519 888 4567 x123',
    email: 'john@resourcesharing.com',
    privacy: false,
    preferredContact: 'phone'
  }, {
    id: 2,
    name: 'Emily',
    phone: '519 888 4567 x456',
    email: 'emily@resourcesharing.com',
    privacy: false,
    preferredContact: 'email'
  }],
  currentUserId: 1
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    default:
      return state;
  }
}