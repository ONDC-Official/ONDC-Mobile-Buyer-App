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
    locationId: any,
    itemId: any,
    increment: boolean,
    uniqueId: any,
    cartItems: any[],
    setCartItemsData: (items: any[]) => void,
  ) => {
    try {
      const newCartItems = JSON.parse(JSON.stringify(cartItems));
      let providerCart: any = newCartItems?.find(
        (cart: any) => cart.location_id === locationId,
      );

      const itemIndex = providerCart.items.findIndex(
        (item: any) => item._id === uniqueId,
      );
      if (itemIndex !== -1) {
        const url = `${API_BASE_URL}${CART}/${uid}/${uniqueId}`;
        source.current = CancelToken.source();
        const newCartItem = providerCart.items[itemIndex];

        if (increment) {
          const productMaxQuantity =
            newCartItem?.item?.product?.quantity?.maximum.count;
          if (newCartItem.item.quantity.count < productMaxQuantity) {
            newCartItem.item.quantity.count =
              newCartItem.item.quantity.count + 1;
          } else {
            showToastWithGravity(
              t('Cart.Maximum allowed quantity is', {
                count: newCartItem.item.quantity.count,
              }),
            );
          }
        } else {
          newCartItem.item.quantity.count -= 1;
        }
        await putDataWithAuth(url, newCartItem.item, source.current.token);
        setCartItemsData(newCartItems);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return {updatingCartItem, updateSpecificCartItem};
};
