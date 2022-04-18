import React, {createContext, useState} from 'react';

export const CartContext = createContext();

const CartContextProvider = ({children}) => {
  const [cart, setCart] = useState([]);
  const [list, setList] = useState(null);

  const storeList = listOfProducts => {
    setList(listOfProducts);
  };

  const storeItemInCart = item => {
    let newArray = cart.slice();
    const index = newArray.findIndex(x => x.id === item.id);
    if (index < 0) {
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

  const clearCart = () => setCart([]);

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
