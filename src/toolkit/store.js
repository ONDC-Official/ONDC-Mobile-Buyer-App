import {configureStore} from '@reduxjs/toolkit';
import auth from './reducer/auth';
import address from './reducer/address';
import cart from './reducer/cart';
import categories from './reducer/categories';
import complaint from './reducer/complaint';
import stores from './reducer/stores';
import order from './reducer/order';

const store = configureStore({
  reducer: {
    auth,
    address,
    cart,
    categories,
    complaint,
    stores,
    order,
  },
});

export default store;
