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
  PREPAID: 'prepaid',
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

export const CANCELLATION_REASONS_SELLER = [
  {
    key: '002',
    value: 'One or more items in the Order not available',
    isApplicableForCancellation: true,
  },
  {
    key: '005',
    value: 'Merchant rejected the order',
    isApplicableForCancellation: false,
  },
  {
    key: '011',
    value: 'Buyer not found or cannot be contacted',
    isApplicableForCancellation: false,
  },
  {
    key: '012',
    value: 'Buyer does not want product any more',
    isApplicableForCancellation: true,
  },
  {
    key: '013',
    value: 'Buyer refused to accept delivery',
    isApplicableForCancellation: false,
  },
  {
    key: '014',
    value: 'Address not found',
    isApplicableForCancellation: false,
  },
  {
    key: '015',
    value: 'Buyer not available at location',
    isApplicableForCancellation: false,
  },
  {
    key: '018',
    value: 'Delivery pin code not serviceable',
    isApplicableForCancellation: false,
  },
  {
    key: '019',
    value: 'Pickup pin code not serviceable',
    isApplicableForCancellation: false,
  },
];

export const START_AUDIO_LISTENER_COMMAND: string[] = [
  'hello sarthi',
  'hello sarathi',
  'hello saarathi',
];

export const VIEW_DELIVERY_OPTIONS_COMMAND: string[] = [
  'view delivery options',
  'view delivery option',
];

export const numberWords: any = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};
