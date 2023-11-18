import {Dimensions, Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import {ToastPosition} from "react-native-toast-message/lib/src/types";

export const isIOS = Platform.OS === 'ios';
const TOAST_VISIBILITY_TIME = 3000;

/**
 * Function is used to show toast on the screen
 * @param message: message to show on tha toast
 **/
export const showToastWithGravity = (message: string) => {
  Toast.show({
    type: 'error',
    text1: message,
    position: 'top',
    visibilityTime: TOAST_VISIBILITY_TIME,
  });
};

/**
 * Function is used to get the initials of the name for avatar
 * @param name: string
 * @returns {string}
 */
export const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map((n, i, a) => (i === 0 || i + 1 === a.length ? n[0] : null))
    .join('')
    .toUpperCase();
};

export const showInfoToast = (message: string, position: ToastPosition = 'top', numberOfLines: number = 1) => {
  Toast.show({
    type: 'info',
    text1: message,
    position: position,
    visibilityTime: TOAST_VISIBILITY_TIME,
  });
};

export const skeletonList = [
  {
    isSkeleton: true,
    _id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b4dcb6d',
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b4dcb6d',
  },
  {
    isSkeleton: true,
    _id: '9b1deb4d-3b7d-4bad-9bed-2b0d7b4dcb6d',
    id: '9b1deb4d-3b7d-4bad-9bed-2b0d7b4dcb6d',
  },
  {
    isSkeleton: true,
    _id: '9b1deb4d-3b7d-4bad-9bfd-2b0d7b4dcb6d',
    id: '9b1deb4d-3b7d-4bad-9bfd-2b0d7b4dcb6d',
  },
  {
    isSkeleton: true,
    _id: '9b1deb4d-3b7d-4bad-9bid-2b0d7b4dcb6d',
    id: '9b1deb4d-3b7d-4bad-9bid-2b0d7b4dcb6d',
  },
  {
    isSkeleton: true,
    _id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b4dcb9d',
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b4dcb9d',
  },
  {
    isSkeleton: true,
    _id: '9b1deb4d-3b7d-4bad-9bde-2b0d7b4dcb6d',
    id: '9b1deb4d-3b7d-4bad-9bde-2b0d7b4dcb6d',
  },
];

/**
 * Function to convert any number to currency
 * @param value: amount in number format
 * @returns {string}
 */
export const maskAmount = value => {
  if (value) {
    return value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      style: 'currency',
      currency: 'INR',
    });
  } else {
    return '';
  }
};

/**
 * Common function used to assign ids to flat list item
 * @param item
 */
export const keyExtractor = (item: any) => item._id;

export const threeForth = Dimensions.get('window').height - 200;

export const half = Dimensions.get('window').height / 2;

/**
 * Check if the value is of type object
 * @param obj
 * @returns {boolean}
 */
const isObject = (obj: any) => {
  return obj != null && obj.constructor.name === 'Object';
};

/**
 * Function is used to remove the keys which has blank/null values
 * @param initialObject: Form object which needs to be cleans
 */
export const cleanFormData = (initialObject: any) => {
  const object = Object.assign({}, initialObject);
  Object.keys(object).forEach(key => {
    if (object[key] == null || object[key] === '' || object[key].length === 0) {
      delete object[key];
    } else {
      if (isObject(object[key])) {
        object[key] = cleanFormData(object[key]);
      }
    }
  });

  return object;
};

export const stringToDecimal = (value: string) => {
  const number = Number(value);
  return number.toFixed(2);
};

export const durationToHumanReadable = (value: any) => {
  const duration = moment.duration(value);
  const minutes = duration.asMinutes();
  if (minutes > 60) {
    const hours = duration.asHours();
    if (hours > 24) {
      const days = duration.asDays();
      return {timeDuration: days, unit: 'days'};
    } else {
      return {timeDuration: hours, unit: 'hrs'};
    }
  } else {
    return {timeDuration: minutes, unit: 'min'};
  }
};
