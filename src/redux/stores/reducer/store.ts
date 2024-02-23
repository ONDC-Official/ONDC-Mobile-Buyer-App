const initialState = {
  locations: [],
};

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'set_stores_list':
      return Object.assign({}, state, {
        locations: action.payload,
      });

    case 'logout_user':
      return Object.assign({}, state, initialState);

    default:
      return state;
  }
};

export default storeReducer;
