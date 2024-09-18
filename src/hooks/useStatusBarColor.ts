import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {StatusBar, StatusBarStyle} from 'react-native';

const useStatusBarColor = (barStyle: StatusBarStyle, color: string) => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(barStyle, true);
      StatusBar.setBackgroundColor(color);
    }, []),
  );
};

export default useStatusBarColor;
