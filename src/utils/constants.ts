export const BRAND_PRODUCTS_LIMIT: number = 10;

export const TAGS: any = {
  non_veg: 'Non-Veg',
  veg: 'Veg',
};

export const CURRENCY_SYMBOLS: any = {
  INR: '₹',
};

export const FB_DOMAIN: string = 'ONDC:RET11';
export const GROCERY_DOMAIN: string = 'ONDC:RET10';
export const FASHION_DOMAIN: string = 'ONDC:RET12';

export const SSE_TIMEOUT: number = 20000;
export const ORDER_PAYMENT_METHODS: any = {
  COD: 'cash_on_delivery',
  JUSPAY: 'juspay',
};

export const CANCELLATION_REASONS = [
  {
    key: '001',
    value:
      'Price of one or more items have changed due to which buyer was asked to make additional payment',
    isApplicableForCancellation: false,
  },
  {
    key: '003',
    value: 'Product available at lower than order price',
    isApplicableForCancellation: false,
  },
  {
    key: '006',
    value: 'Order not received as per buyer app TAT SLA',
    isApplicableForCancellation: false,
  },
  {
    key: '009',
    value: 'Wrong product delivered',
    isApplicableForCancellation: false,
  },
  {
    key: '010',
    value: 'Buyer wants to modify address / other order details',
    isApplicableForCancellation: false,
  },
];

export const RETURN_REASONS = [
  {
    key: '001',
    value: 'Buyer does not want product any more',
    isApplicableForNonReturnable: false,
  },
  {
    key: '002',
    value: 'Product available at lower than order price',
    isApplicableForNonReturnable: false,
  },
  {
    key: '003',
    value: 'Product damaged or not in usable state',
    isApplicableForNonReturnable: true,
  },
  {
    key: '004',
    value: 'Product is of incorrect quantity or size',
    isApplicableForNonReturnable: true,
  },
  {
    key: '005',
    value: 'Product delivered is different from what was shown and ordered',
    isApplicableForNonReturnable: true,
  },
];
