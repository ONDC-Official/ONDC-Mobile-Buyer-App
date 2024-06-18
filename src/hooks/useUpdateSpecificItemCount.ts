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
  const [updatingCartItem, setUpdatingCartItem] = useState<any>(null);
  const {putDataWithAuth} = useNetworkHandling();
  const {uid} = useSelector(({auth}) => auth);
  const source = useRef<any>(null);

  const updateSpecificCartItem = async (
    itemId: any,
    increment: boolean,
    uniqueId: any,
    cartItems: any[],
    setCartItems: (items: any[]) => void,
  ) => {
    try {
      setUpdatingCartItem(uniqueId);
      const url = `${API_BASE_URL}${CART}/${uid}/${uniqueId}`;
      const items = cartItems.concat([]);
      const itemIndex = items.findIndex((item: any) => item._id === uniqueId);
      if (itemIndex !== -1) {
        source.current = CancelToken.source();
        let updatedCartItem = items[itemIndex];
        updatedCartItem.id = updatedCartItem.item.id;

        if (increment) {
          const productMaxQuantity =
            updatedCartItem?.item?.product?.quantity?.maximum;
          if (productMaxQuantity) {
            if (
              updatedCartItem.item.quantity.count < productMaxQuantity.count
            ) {
              updatedCartItem.item.quantity.count += 1;

              let customisations = updatedCartItem.item.customisations;

              if (customisations) {
                customisations = customisations.map((customisation: any) => {
                  return {
                    ...customisation,
                    quantity: {
                      ...customisation.quantity,
                      count: customisation.quantity.count + 1,
                    },
                  };
                });

                updatedCartItem.item.customisations = customisations;
              } else {
                updatedCartItem.item.customisations = null;
              }

              updatedCartItem = updatedCartItem.item;

              await putDataWithAuth(url, updatedCartItem, source.current.token);
            } else {
              showToastWithGravity(
                t('Cart.Maximum allowed quantity', {
                  count: updatedCartItem.item.quantity.count,
                }),
              );
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
              customisations = customisations.map((customisation: any) => {
                return {
                  ...customisation,
                  quantity: {
                    ...customisation.quantity,
                    count: customisation.quantity.count - 1,
                  },
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
        setCartItems(items);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setUpdatingCartItem(null);
    }
  };

  return {updatingCartItem, updateSpecificCartItem};
};
