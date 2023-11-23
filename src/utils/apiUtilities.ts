export const BASE_URL: string = 'https://ref-app-buyer-staging-v2.ondc.org';
export const UPDATE_ORDER: string = '/clientApis/v1/update';
export const GET_MESSAGE_ID: string = '/clientApis/v1/search';
export const GET_PRODUCTS: string = '/clientApis/v1/on_search?messageId=';
export const GET_LOCATION: string = '/mmi/api/mmi_query?query=';
export const GET_LOCATION_FROM_LAT_LONG: string = '/mmi/api/mmi_latlong_info?';
export const GET_LATLONG: string = '/mmi/api/mmi_place_info?eloc=';
export const DELIVERY_ADDRESS: string = '/clientApis/v1/delivery_address';
export const RAISE_COMPLAINT: string = '/clientApis/v2/complaint';
export const UPDATE_DELIVERY_ADDRESS =
  '/clientApis/v1/update_delivery_address/';
export const BILLING_ADDRESS: string = '/clientApis/v1/billing_details';
export const UPDATE_BILLING_ADDRESS: string =
  '/clientApis/v1/update_billing_details/';
export const GET_ORDERS: string = '/clientApis/v1/orders';
export const GET_SELECT: string = '/clientApis/v2/select';
export const ON_GET_SELECT: string = '/clientApis/v2/on_select?';
export const INITIALIZE_ORDER: string = '/clientApis/v2/initialize_order';
export const ON_INITIALIZE_ORDER: string =
  '/clientApis/v2/on_initialize_order?';
export const CONFIRM_ORDER: string = '/clientApis/v2/confirm_order';
export const ON_CONFIRM_ORDER: string = '/clientApis/v2/on_confirm_order?';
export const SIGN_PAYLOAD: string = '/clientApis/payment/signPayload';
export const CANCEL_ORDER: string = '/clientApis/v1/cancel_order';
export const ON_CANCEL_ORDER: string = '/clientApis/v1/on_cancel_order?';
export const TRACK_ORDER: string = '/clientApis/v2/track';
export const ON_TRACK_ORDER: string = '/clientApis/v2/on_track?';
export const SUPPORT: string = '/clientApis/v2/get_support';
export const ON_SUPPORT: string = '/clientApis/v2/on_support?';
export const CALL: string = '/knowlarity/api/call-patron';
export const FILTER: string = '/clientApis/v1/getFilterParams?messageId=';
export const GET_STATUS: string = '/clientApis/v2/order_status';
export const ON_GET_STATUS: string =
  '/clientApis/v2/on_order_status?messageIds=';
export const GET_GPS_CORDS: string = '/mmi/api/mmi_pin_info?pincode=';
export const ON_UPDATE_ORDER: string = '/clientApis/v2/on_update?';
