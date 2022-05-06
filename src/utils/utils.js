import {Platform} from 'react-native';
import Toast from 'react-native-toast-message';

export const isIOS = Platform.OS === 'ios';

/**
 * Function is used to show toast on the screen
 * @param message:message to show on tha toast
 **/
export const showToastWithGravity = message => {
  Toast.show({
    type: 'error',
    text1: message,
    position: 'top',
  });
};

/**
 * Function is used to get the initials of the name for avatar
 * @param name: string
 * @returns {string}
 */
export const getUserInitials = name => {
  return name
    .split(' ')
    .map((n, i, a) => (i === 0 || i + 1 === a.length ? n[0] : null))
    .join('')
    .toUpperCase();
};

export const showInfoToast = message => {
  Toast.show({
    type: 'info',
    text1: message,
    position: 'top',
  });
};

export const skeletonList = [
  {isSkeleton: true, _id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b4dcb6d'},
  {isSkeleton: true, _id: '9b1deb4d-3b7d-4bad-9bed-2b0d7b4dcb6d'},
  {isSkeleton: true, _id: '9b1deb4d-3b7d-4bad-9bfd-2b0d7b4dcb6d'},
  {isSkeleton: true, _id: '9b1deb4d-3b7d-4bad-9bid-2b0d7b4dcb6d'},
  {isSkeleton: true, _id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b4dcb9d'},
  {isSkeleton: true, _id: '9b1deb4d-3b7d-4bad-9bde-2b0d7b4dcb6d'},
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
export const keyExtractor = item => item._id;
