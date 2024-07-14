import {useSelector} from 'react-redux';
import {useRef} from 'react';
import axios from 'axios';
import useNetworkHandling from './useNetworkHandling';
import {API_BASE_URL, CART} from '../utils/apiActions';
import {showToastWithGravity} from '../utils/utils';

const CancelToken = axios.CancelToken;

export default () => {
  const source = useRef<any>(null);
  const {uid} = useSelector(({auth}) => auth);
  const {putDataWithAuth} = useNetworkHandling();

  const updateCartItem = async (
    cartItems: any[],
    increment: boolean,
    uniqueId: any,
  ) => {
    try {
      const itemIndex = cartItems.findIndex(
        (item: any) => item._id === uniqueId,
      );
      if (itemIndex !== -1) {
        const url = `${API_BASE_URL}${CART}/${uid}/${uniqueId}`;
        source.current = CancelToken.source();
        const items = cartItems[itemIndex];
        const newObject = {
          ...items,
          item: {...items.item, quantity: {...items.item.quantity}},
        };
        if (increment) {
          const productMaxQuantity =
            newObject?.item?.product?.quantity?.maximum;
          if (productMaxQuantity) {
            newObject.item.quantity.count += 1;
          } else {
            showToastWithGravity(
              `Maximum allowed quantity is ${newObject.item.quantity.count}`,
            );
          }
        } else {
          newObject.item.quantity.count -= 1;
        }
        await putDataWithAuth(url, newObject.item, source.current.token);
        return newObject;
      }
    } catch (e) {
      console.log(e);
    }
  };

  return {updateCartItem};
};
