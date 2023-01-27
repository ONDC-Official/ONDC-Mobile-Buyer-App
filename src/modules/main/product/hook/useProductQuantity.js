import {
  addItemToCart,
  removeItemFromCart,
  updateItemInCart,
} from '../../../../redux/actions';
import {showInfoToast} from '../../../../utils/utils';
import {useDispatch} from 'react-redux';

export default item => {
  const dispatch = useDispatch();

  /**
   * function handles click event add button
   */
  const addItem = () => {
    let product = Object.assign({}, item, {quantity: 1});

    if (item?.hasOwnProperty('quantityMeta')) {
      if (item?.quantityMeta?.available?.count > 1) {
        dispatch(addItemToCart(product));
      } else {
        showInfoToast('Product not available at the moment please try again');
      }
    } else {
      dispatch(addItemToCart(product));
    }

    return product;
  };

  /**
   * function handles click event of increase and decrease buttons
   */
  const updateQuantity = (increase = true) => {
    const newQuantity = increase ? item.quantity + 1 : item.quantity - 1;
    let product = Object.assign({}, item, {quantity: newQuantity});

    if (newQuantity > item?.quantityMeta?.available?.count) {
      showInfoToast(
        `Only ${item?.quantityMeta?.available?.count} unit(s) of this product are available at the moment`,
      );
      return item;
    } else if (newQuantity > item?.quantityMeta?.maximum?.count) {
      showInfoToast(
        `Only ${item?.quantityMeta?.maximum?.count} unit(s) of this product can be added per order`,
      );
      return item;
    } else {
      if (newQuantity === 0) {
        dispatch(removeItemFromCart(product));
      } else {
        dispatch(updateItemInCart(product));
      }
      return product;
    }
  };

  return {
    addItem,
    updateQuantity,
  };
};
