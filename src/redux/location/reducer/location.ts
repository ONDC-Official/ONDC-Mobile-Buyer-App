import {
  CLEAR_LOCATION,
  SAVE_CITY_STATE,
  SAVE_LAT_LONG,
  SAVE_PINCODE,
} from '../action';

const initialState = {
  latitude: null,
  longitude: null,
  pinCode: null,
  city: null,
  state: null,
};

const locationReducer = (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case SAVE_LAT_LONG:
      return Object.assign({}, state, {
        latitude: payload.latitude,
        longitude: payload.longitude,
      });

    case SAVE_PINCODE:
      return Object.assign({}, state, {
        pinCode: payload,
      });

    case SAVE_CITY_STATE:
      return Object.assign({}, state, {
        city: payload.city,
        state: payload.state,
      });

    case CLEAR_LOCATION:
      return initialState;

    default:
      return state;
  }
};

export default locationReducer;
