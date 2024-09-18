import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';

const useBackHandler = () => {
  const navigation = useNavigation();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {goBack};
};

export default useBackHandler;
