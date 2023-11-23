import { useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { updateToken } from "../redux/auth/actions";
import { useDispatch } from "react-redux";

export default () => {
  const dispatch = useDispatch();

  useEffect(() => {
    auth()
      .currentUser.getIdToken(true)
      .then(idToken => {
        updateToken(dispatch, idToken);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return {};
};
