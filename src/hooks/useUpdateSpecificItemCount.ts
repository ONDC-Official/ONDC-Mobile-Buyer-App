import {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useTranslation} from 'react-i18next';

import {API_BASE_URL, CART} from '../utils/apiActions';
import {showToastWithGravity} from '../utils/utils';
import useNetworkHandling from './useNetworkHandling';

const CancelToken = axios.CancelToken;

export default () => {
  const {t} = useTranslation();
  const [updatingCartItem] = useState<any>(null);
  const {putDataWithAuth} = useNetworkHandling();
  const {uid} = useSelector(({auth}) => auth);
  const source = useRef<any>(null);

  const updateSpecificCartItem = async (
    itemId: any,
    increment: boolean,
    uniqueId: any,
    cartItems: any[],
    setCartItemsData: (items: any[]) => void,
  ) => {
    try {
      const itemIndex = cartItems.findIndex(
        (item: any) => item._id === uniqueId,
      );
      if (itemIndex !== -1) {
        const url = `${API_BASE_URL}${CART}/${uid}/${uniqueId}`;
        source.current = CancelToken.source();
        var items = cartItems[itemIndex];

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

        const finalData = cartItems.map(item =>
          item._id === uniqueId ? newObject : item,
        );

        setCartItemsData(finalData);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('finally');
    }
  };

  return {updatingCartItem, updateSpecificCartItem};
};
