import {configureStore} from '@reduxjs/toolkit';
import auth from './reducer/auth';
import address from './reducer/address';
import cart from './reducer/cart';
import wishlist from './reducer/wishlist';
import categories from './reducer/categories';
import complaint from './reducer/complaint';
import stores from './reducer/stores';
import order from './reducer/order';

const store = configureStore({
  reducer: {
    auth,
    address,
    cart,
    wishlist,
    categories,
    complaint,
    stores,
    order,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      ignoredPaths: ['navigation.params.handleDeepLink'],
    }),
});

export default store;
