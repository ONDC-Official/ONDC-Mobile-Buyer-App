import {useSelector} from 'react-redux';
import {useRef} from 'react';
import axios from 'axios';
import useNetworkHandling from './useNetworkHandling';
import {API_BASE_URL} from '../utils/apiActions';

const CancelToken = axios.CancelToken;

export default () => {
  const source = useRef<any>(null);
  const {uid} = useSelector(({authReducer}) => authReducer);
  const {putDataWithAuth} = useNetworkHandling();

  const updateCartItem = async (
    cartItems: any[],
    increment: boolean,
    uniqueId: any,
  ) => {
    const url = `${API_BASE_URL}/clientApis/v2/cart/${uid}/${uniqueId}`;
    source.current = CancelToken.source();
    const items = cartItems.concat([]);
    const itemIndex = items.findIndex((item: any) => item._id === uniqueId);
    if (itemIndex !== -1) {
      let updatedCartItem = items[itemIndex];
      updatedCartItem.id = updatedCartItem.item.id;

      if (increment) {
        const productMaxQuantity =
          updatedCartItem?.item?.product?.quantity?.maximum;
        if (productMaxQuantity) {
          if (updatedCartItem.item.quantity.count < productMaxQuantity.count) {
            updatedCartItem.item.quantity.count += 1;

            let customisations = updatedCartItem.item.customisations;

            if (customisations) {
              customisations = customisations.map(c => {
                return {
                  ...c,
                  quantity: {...c.quantity, count: c.quantity.count + 1},
                };
              });
              updatedCartItem.item.customisations = customisations;
            } else {
              updatedCartItem.item.customisations = null;
            }

            updatedCartItem = updatedCartItem.item;
            await putDataWithAuth(url, updatedCartItem, source.current.token);
          }
        } else {
          updatedCartItem.item.quantity.count += 1;
          updatedCartItem = updatedCartItem.item;
          await putDataWithAuth(url, updatedCartItem, source.current.token);
        }
      } else {
        if (updatedCartItem.item.quantity.count > 1) {
          updatedCartItem.item.quantity.count -= 1;

          let customisations = updatedCartItem.item.customisations;
          if (customisations) {
            customisations = customisations.map(c => {
              return {
                ...c,
                quantity: {...c.quantity, count: c.quantity.count - 1},
              };
            });
            updatedCartItem.item.customisations = customisations;
          } else {
            updatedCartItem.item.customisations = null;
          }
          updatedCartItem = updatedCartItem.item;
          await putDataWithAuth(url, updatedCartItem, source.current.token);
        }
      }
    }
  };

  return {updateCartItem};
};
