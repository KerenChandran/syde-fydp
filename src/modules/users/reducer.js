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
  }, {
    id: 3,
    name: 'Sid',
    phone: '647 555 1234',
    email: 'sid@resourcesharing.com',
    privacy: false,
    preferredContact: 'email'
  }, {
    id: 4,
    name: 'Julia',
    phone: '416 987 4321',
    email: 'julia@resourcesharing.com',
    privacy: false,
    preferredContact: 'phone'
  }, {
    id: 5,
    name: 'Abbey',
    phone: '905 203 5678',
    email: 'abbey@resourcesharing.com',
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