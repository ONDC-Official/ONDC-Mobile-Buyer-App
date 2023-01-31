export const SEARCH_QUERY = {
  PRODUCT: 'Product',
  PROVIDER: 'Provider',
  CATEGORY: 'Category',
  UNKNOWN: 'Unknown',
};

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
    orderType: 'ON-FULFILLMENT',
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

export const APPLICATION_VERSION = '1.0.3';

export const SUB_CATEGORY_CATEGORY = {
  'Fruits and Vegetables': 'Grocery',
  'Masala & Seasoning': 'Grocery',
  'Oil & Ghee': 'Grocery',
  'Gourmet & World Foods': 'Grocery',
  Foodgrains: 'Grocery',
  'Eggs, Meat & Fish': 'Grocery',
  'Cleaning & Household': 'Grocery',
  Beverages: 'Grocery',
  'Beauty & Hygiene': 'Grocery',
  'Bakery, Cakes & Dairy': 'Grocery',
  'Kitchen Accessories': 'Grocery',
  'Baby Care': 'Grocery',
  'Snacks & Branded Foods': 'Grocery',
  'Pet Care': 'Grocery',
  Stationery: 'Grocery',
  'Packaged Commodities': 'Grocery',
  'Packaged Foods': 'Grocery',
  Continental: 'Food & Beverage',
  'Middle Eastern': 'Food & Beverage',
  'North Indian': 'Food & Beverage',
  'Pan-Asian': 'Food & Beverage',
  'Regional Indian': 'Food & Beverage',
  'South Indian': 'Food & Beverage',
  'Tex-Mexican': 'Food & Beverage',
  'World Cuisines': 'Food & Beverage',
  'Healthy Food': 'Food & Beverage',
  'Fast Food': 'Food & Beverage',
  Desserts: 'Food & Beverage',
  'Bakery, Cakes & Dairy (MTO)': 'Food & Beverage',
  'Beverages (MTO)': 'Food & Beverage',
  'F&B': 'Food & Beverage',
};

export const TAGS = {
  non_veg: 'Non-Veg',
  veg: 'Veg',
};
