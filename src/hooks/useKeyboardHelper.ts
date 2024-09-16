import {EmitterSubscription, Keyboard} from 'react-native';
import {useEffect, useState} from 'react';
import {isIOS} from '../utils/constants';

const useKeyboardHelper = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    let keyboardDidShowListener: EmitterSubscription,
      keyboardDidHideListener: EmitterSubscription;
    if (!isIOS) {
      keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardVisible(true); // Hide the element
      });
      keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardVisible(false); // Show the element
      });
    }

    // Clean up listeners on component unmount
    return () => {
      if (!isIOS) {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      }
    };
  }, []);

  return {isKeyboardVisible};
};

export default useKeyboardHelper;
