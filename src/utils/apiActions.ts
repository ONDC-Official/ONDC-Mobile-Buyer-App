import Config from 'react-native-config';

export const API_BASE_URL: string = Config.API_BASE_URL ?? '';
export const PROVIDERS: string = '/clientApis/v2/providers';
export const DELIVERY_ADDRESS: string = '/clientApis/v1/delivery_address';
export const BILLING_ADDRESS: string = '/clientApis/v1/billing_details';
export const UPDATE_DELIVERY_ADDRESS: string =
  '/clientApis/v1/update_delivery_address';
export const LOCATIONS: string = '/protocol/locations';
export const MAP_ACCESS_TOKEN: string = '/clientApis/v2/map/accesstoken';
export const PROVIDER: string = '/protocol/provider-details';
export const STORE_DETAILS: string = '/protocol/location-details';
export const CUSTOM_MENU: string = '/clientApis/v2/custom-menus';
export const PRODUCT_ATTRIBUTES: string = '/clientApis/v2/attributes';
export const PRODUCT_ATTRIBUTE_VALUES: string =
  '/clientApis/v2/attributeValues';
export const PRODUCT_SEARCH: string = '/clientApis/v2/search';
export const ITEMS: string = '/clientApis/v2/items';
export const PROVIDER_LOCATIONS: string = '/clientApis/v2/locations';
export const ITEM_DETAILS: string = '/protocol/item-details';
export const ORDERS: string = '/clientApis/v2/orders';
export const ORDER_STATUS: string = '/clientApis/v2/order_status';
export const TRACK_ORDER: string = '/clientApis/v2/track';
export const CART: string = '/clientApis/v2/cart';
export const GET_ISSUES: string = '/issueApis/v1/getIssues';
export const ON_SELECT: string = '/clientApis/v2/on_select?messageIds=';

export const SELECT: string = '/clientApis/v2/select';
export const CONFIRM_ORDER: string = '/clientApis/v2/confirm_order';
export const ON_CONFIRM: string = '/clientApis/v2/on_confirm_order?messageIds=';
export const EVENTS: string = '/clientApis/events/v2?messageId=';
export const ISSUE: string = '/issueApis/events?messageId=';
export const ON_ISSUE: string = '/issueApis/v1/on_issue?messageId=';
export const INITIALIZE_ORDER: string = '/clientApis/v2/initialize_order';
export const ON_INITIALIZE: string =
  '/clientApis/v2/on_initialize_order?messageIds=';

export const CANCEL_ORDER: string = '/clientApis/v2/cancel_order';
export const RETURN_ORDER: string = '/clientApis/v2/update';
export const ON_UPDATE: string = '/clientApis/v2/on_update?messageId=';

export const GET_SIGN_URL: string = '/clientApis/v2/getSignUrlForUpload';

export const RAISE_ISSUE: string = '/issueApis/v1/issue';

export const ISSUE_STATUS: string = '/issueApis/v1/issue_status';
export const ON_ISSUE_STATUS: string =
  '/issueApis/v1/on_issue_status?messageId=';

export const ORDER_EVENT: string = '/clientApis/events?messageId=';

export const RAZORPAY_KEYS: string = '/clientApis/v2/razorpay/razorPay/keys';
export const CREATE_PAYMENT: string = '/clientApis/v2/razorpay/';
