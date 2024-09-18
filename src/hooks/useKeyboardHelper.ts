import {Keyboard} from 'react-native';
import {useEffect, useState} from 'react';

const useKeyboardHelper = () => {
  const [keyboardShown, setKeyboardShown] = useState<boolean>(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardShown(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardShown(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return {keyboardShown};
};

export default useKeyboardHelper;
