import React, {createContext, useState} from 'react';
import productList from '../modules/main/product/ProductsList';

export const CartContext = createContext();

const CartContextProvider = ({children}) => {
  const [cart, setCart] = useState([]);
  const [list, setList] = useState(productList);

  const storeList = listOfProducts => {
    setList(listOfProducts);
  };

  const storeItemInCart = item => {
    let newArray = cart.slice();
    const index = newArray.findIndex(x => x.id === item.id);
    if (index > -1) {
      console.log('exist');
    } else {
      newArray.push(item);
    }
    setCart(newArray);
  };

  const removeItemFromCart = () => {
    let newArray = cart.slice();
    const filteredArray = newArray.filter(item => {
      return item.quantity !== 0;
    });
    setCart(filteredArray);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        list,
        storeItemInCart,
        removeItemFromCart,
        clearCart,
        storeList,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
