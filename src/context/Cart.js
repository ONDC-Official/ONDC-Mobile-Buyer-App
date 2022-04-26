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
    if (index > -1) {
      if (newArray[index].quantity !== item.quantity) {
        newArray[index].quantity = item.quantity;
      }
    } else {
      newArray.push(item);
    }
    setCart(newArray);
  };

  const updateItemInCart = cartItem => {
    const newArray = cart.slice();
    const selectedItem = newArray.find(item => {
      return item.id === cartItem.id;
    });
    selectedItem.quantity -= 1;
    const filteredArray = newArray.filter(item => {
      return item.quantity !== 0;
    });
    setCart(filteredArray);
  };

  const removeItemFromCart = item => {
    let newArray = cart.slice();
    const index = newArray.findIndex(x => x.id === item.id);
    if (index > -1) {
      if (newArray[index].quantity !== item.quantity) {
        newArray[index].quantity = item.quantity;
      }
    } else {
      newArray.push(item);
    }
    const filteredArray = newArray.filter(cartItem => {
      return cartItem.quantity !== 0;
    });
    setCart(filteredArray);
  };

  const updateCart = addedItem => {
    const newArray = cart.slice();
    const selectedItem = newArray.find(item => {
      return item.id === addedItem.id;
    });
    selectedItem.quantity += 1;
    setCart(newArray);
  };

  const clearCart = () => {
    setCart([]);
    let newArray = list.slice();
    newArray.forEach(item => {
      item.quantity = 0;
    });
    setList(newArray);
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
        updateCart,
        updateItemInCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
