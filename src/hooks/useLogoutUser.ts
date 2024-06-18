import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {clearAll} from '../utils/storage';
import {logoutUser} from '../toolkit/reducer/auth';
import {clearAddress} from '../toolkit/reducer/address';
import {clearCart} from '../toolkit/reducer/cart';
import {clearComplaint} from '../toolkit/reducer/complaint';
import {clearOrder} from '../toolkit/reducer/order';
import {clearStoresList} from '../toolkit/reducer/stores';

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const clearDataAndLogout = async () => {
    await clearAll();
    dispatch(logoutUser());
    dispatch(clearAddress());
    dispatch(clearCart());
    dispatch(clearComplaint());
    dispatch(clearOrder());
    dispatch(clearStoresList());

    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return {clearDataAndLogout};
};
