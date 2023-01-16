import {clearMultiple, getMultipleData, getStoredData, saveMultipleData,} from '../../utils/storage';

export const tryLocalSignIn = (dispatch, navigation) => {
  const payload = {};

  getMultipleData(['token', 'uid', 'emailId', 'name'])
    .then(data => {
      if (data[0][1] !== null) {
        data.forEach(item => {
          try {
            payload[item[0]] = JSON.parse(item[1]);
          } catch (error) {
            payload[item[0]] = item[1];
          }
        });
        dispatch({type: 'save_user', payload});
        getStoredData('address').then(address => {
          if (address) {

            navigation.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: 'AddDefaultAddress'}],
            });
          }
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: 'SignUp'}],
        });
      }
    })
    .catch(error => {
      dispatch({type: 'hide_loader', payload});
    });
};

export const logoutUser = dispatch => {
  clearMultiple(['uid', 'emailId', 'token', 'name']).then(() => {
    dispatch({
      type: 'logout_user',
    });
  });
};

export const storeLoginDetails = (dispatch, data) => {
  const {token, emailId, uid, name, photoURL} = data;
  saveMultipleData([
    ['token', token],
    ['emailId', emailId],
    ['uid', uid],
    ['name', name],
    ['photoURL', photoURL],
  ]).then(() => {
    const payload = {
      token: token,
      emailId: emailId,
      uid: uid,
      name: name,
      photoURL: photoURL,
    };
    dispatch({type: 'set_login_details', payload});
  });
};
