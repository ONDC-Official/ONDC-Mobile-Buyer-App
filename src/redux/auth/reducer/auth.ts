const initialState = {
  token: null,
  uid: null,
  emailId: null,
  name: null,
  photoURL: null,
};

const authReducer = (
  state = initialState,
  action: {type: string; payload: any},
) => {
  switch (action.type) {
    case 'set_login_details':
      return Object.assign({}, state, {
        token: action.payload.token,
        emailId: action.payload.emailId,
        uid: action.payload.uid,
        name: action.payload.name,
        photoURL: action.payload.photoURL,
        transaction_id: action.payload.transaction_id,
      });

    case 'set_token':
      return Object.assign({}, state, {
        token: action.payload,
      });

    case 'hide_loader':
      return {...state, isLoading: false};

    case 'logout_user':
      return Object.assign({}, state, initialState);

    case 'save_user':
      return action.payload;

    default:
      return state;
  }
};

export default authReducer;
