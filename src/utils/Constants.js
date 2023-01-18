export const SEARCH_QUERY = {
  PRODUCT: 'Product',
  PROVIDER: 'Provider',
  CATEGORY: 'Category',
};

export const OPTIONS = {
  PROFILE: 'Profile',
  LOG_OUT: 'Log Out',
  SUPPORT: 'Support',
};

export const PAYMENT_OPTIONS = [
  {value: 'JUSPAY', label: 'Prepaid'},
  {value: 'COD', label: 'Cash on delivery'},
];

export const UPDATE_TYPE = {
  RETURN: 'return',
  CANCEL: 'cancel',
};

export const PAYMENT_METHODS = {
  JUSPAY: {
    name: 'JUSPAY',
    type: 'ON-ORDER',
  },
  COD: {
    name: 'COD',
    orderType: 'POST-FULFILLMENT',
  },
};

export const ORDER_STATUS = {
  CANCELLED: 'Cancelled',
  DELIVERED: 'DELIVERED',
};

export const POLICY_URL =
  'https://github.com/Open-network-for-digital-commerce';

export const FAQS = 'https://ondc.org/Bring-buyers-on-the-network.html';

export const ONDC_POLICY = 'https://ondc.org/index.html';

export const CONTACT_US = 'https://ondc.org/contactus.html';

export const PRODUCT_SORTING = {
  RATINGS_HIGH_TO_LOW: 'Rating: High To Low',
  RATINGS_LOW_TO_HIGH: 'Ratings: Low To High',
  PRICE_HIGH_TO_LOW: 'Price: High To Low',
  PRICE_LOW_TO_HIGH: 'Price: Low To High',
};

export const DELIVERY_CHARGES = 'Delivery charges';

export const APPLICATION_VERSION = '1.0.1';
