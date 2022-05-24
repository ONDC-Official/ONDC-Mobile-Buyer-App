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

export const AVATAR_SIZES = {
  NORMAL: 40,
  LARGE: 64,
};

export const PAYMENT_OPTIONS = [
  {value: 'JUSPAY', label: 'Prepaid'},
  {value: 'COD', label: 'Cash on delivery'},
];

export const PAYMENT_METHODS = {
  JUSPAY: {
    name: 'JUSPAY',
    orderType: 'ON-ORDER',
    status: 'PAID',
  },
  COD: {
    name: 'COD',
    orderType: 'ON-FULFILLMENT',
    status: 'NOT-PAID',
  },
};

export const ORDER_STATUS = {
  CANCELLED: 'CANCELLED',
  DELIVERED: 'DELIVERED',
};

export const POLICY_URL =
  'https://github.com/Open-network-for-digital-commerce';

export const FAQS = 'https://ondc.org/Bring-buyers-on-the-network.html';

export const ONDC_POLICY = 'https://ondc.org/index.html';

export const CONTACT_US = 'https://ondc.org/contactus.html';

export const PRODUCT_SORTING = {
  RATINGS_HIGH_TO_LOW: 'Rating: high to low',
  RATINGS_LOW_TO_HIGH: 'Ratings: Low to high',
  PRICE_HIGH_TO_LOW: 'Price: High to low',
  PRICE_LOW_TO_HIGH: 'Price: Low to high',
};
