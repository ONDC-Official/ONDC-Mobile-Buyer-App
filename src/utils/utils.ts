import {Dimensions, Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import {ToastPosition} from 'react-native-toast-message/lib/src/types';
import Config from 'react-native-config';
import CryptoJS from 'crypto-js';
import getDistance from 'geolib/es/getDistance';

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

export const showInfoToast = (
  message: string,
  position: ToastPosition = 'top',
) => {
  Toast.show({
    type: 'info',
    text1: message,
    position: position,
    visibilityTime: TOAST_VISIBILITY_TIME,
  });
};

export const skeletonList: any[] = [
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
 * Common function used to assign ids to flat list item
 * @param item
 */
export const keyExtractor = (item: any) => item._id;

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

export const createCustomizationAndGroupMapping = (customizations: any[]) => {
  let newCustomizationGroupMappings: any = {};
  let customizationToGroupMap: any = {};
  customizations?.forEach((customization: any) => {
    const groupId = customization.parent;
    const childId = customization.id;

    customizationToGroupMap = {
      ...customizationToGroupMap,
      [customization.id]:
        customization.childs == undefined ? [] : customization.childs,
    };

    if (!newCustomizationGroupMappings[groupId]) {
      newCustomizationGroupMappings[groupId] = new Set();
    }
    newCustomizationGroupMappings[groupId].add(childId);
  });

  const finalizedCustomizationGroupMappings: any = {};
  for (const groupId in newCustomizationGroupMappings) {
    finalizedCustomizationGroupMappings[groupId] = Array.from(
      newCustomizationGroupMappings[groupId],
    );
  }

  return {
    customizationToGroupMap,
    groupToCustomizationMap: finalizedCustomizationGroupMappings,
  };
};

export const constructQuoteObject = (cartItems: any[]) => {
  const map = new Map();
  cartItems.map((item: any) => {
    let bpp_uri = item?.product?.context?.bpp_uri;
    if (bpp_uri) {
      item.bpp_uri = bpp_uri;
    }

    const provider_id = item?.provider?.id;
    if (map.get(provider_id)) {
      return map.set(provider_id, [...map.get(provider_id), item]);
    }
    return map.set(provider_id, [item]);
  });
  return Array.from(map.values());
};

export const getPriceWithCustomisations = (cartItem: any) => {
  let basePrice = cartItem.item.product.price.value;
  let price = 0;
  cartItem?.item?.customisations?.map(
    (customisation: any) => (price += customisation.item_details.price.value),
  );

  return basePrice + price;
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

export const removeNullValues = (object: any) => {
  Object.entries(object).forEach(([k, v]) => {
    if (v && typeof v === 'object') {
      removeNullValues(v);
    }
    if (
      (v && typeof v === 'object' && !Object.keys(v).length) ||
      v === null ||
      v === undefined ||
      v.length === 0
    ) {
      if (Array.isArray(object)) {
        object.splice(k, 1);
      } else if (!(v instanceof Date)) {
        delete object[k];
      }
    }
  });
  return object;
};

const getSingleCustomization = (
  groupId: any,
  customizationState: any,
  selectedCustomizationIds: any[],
) => {
  let group = customizationState[groupId];
  if (!group) {
    return selectedCustomizationIds;
  }

  group.selected.map((selected: any) =>
    selectedCustomizationIds.push(selected.id),
  );
  group?.childs?.map((child: any) => {
    selectedCustomizationIds = getSingleCustomization(
      child,
      customizationState,
      selectedCustomizationIds,
    );
  });
  return selectedCustomizationIds;
};

export const getCustomizations = async (
  product: any,
  customizationState: any,
) => {
  const {customisation_items} = product;
  const customizations: any[] = [];

  const firstGroupId = customizationState.firstGroup?.id;
  if (!firstGroupId) {
    return;
  }

  const selectedCustomizationIds = getSingleCustomization(
    firstGroupId,
    customizationState,
    [],
  );

  for (const cId of selectedCustomizationIds) {
    let customizationItem = customisation_items.find(
      (item: any) => item.local_id === cId,
    );
    if (customizationItem) {
      customizationItem = {
        ...customizationItem,
        quantity: {
          count: 1,
        },
      };
      customizations.push(customizationItem);
    }
  }
  return customizations;
};

export const isItemCustomization = (tags: any[]) => {
  let isCustomization = false;
  tags?.forEach((tag: any) => {
    if (tag.code === 'type') {
      tag.list.forEach((listOption: any) => {
        if (
          listOption.code === 'type' &&
          listOption.value === 'customization'
        ) {
          isCustomization = true;
          return true;
        }
      });
    }
  });
  return isCustomization;
};

export const parseDuration = (duration: number) => {
  return moment.duration(duration).asMilliseconds();
};

export const compareDateWithDuration = (duration: any, dateStr: string) => {
  const currentDate = new Date();
  const providedDate = new Date(dateStr);
  // Parse the duration
  const durationInMilliseconds = parseDuration(duration);
  // Add the duration to the provided date
  const newDate = new Date(providedDate.getTime() + durationInMilliseconds);
  // Compare the new date with the current date
  return currentDate.getTime() > newDate.getTime();
};

export const getFilterCategory = (tags: any) => {
  let category = 'veg';

  tags?.forEach((tag: any) => {
    if (tag.code === 'veg_nonveg') {
      const vegNonVegValue = tag.list[0].value;
      if (vegNonVegValue === 'yes' || vegNonVegValue === 'Yes') {
        category = 'veg';
      } else if (vegNonVegValue === 'no') {
        category = 'nonveg';
      } else if (vegNonVegValue === 'egg') {
        category = 'egg';
      }
    }
  });

  return category;
};

export const getUrlParams = (url: string) => {
  const urlParams: any = {};
  const params = url.split('?');
  if (params.length > 0) {
    const variables = params[1].split('&');
    variables.forEach((one: any) => {
      const fields = one.split('=');
      if (fields.length > 0) {
        urlParams[fields[0]] = fields[1];
      }
    });
  }
  return urlParams;
};

// Encryption function
export const encryptData = (data: any) => {
  // Convert data to string
  const dataString = JSON.stringify(data);
  // Encrypt data using AES encryption algorithm with the provided key
  return CryptoJS.AES.encrypt(dataString, Config.ENCRYPTION_KEY).toString();
};

// Decryption function
export const decryptData = (encryptedData: any) => {
  // Decrypt data using AES decryption algorithm with the provided key
  const decryptedData = CryptoJS.AES.decrypt(
    encryptedData,
    Config.ENCRYPTION_KEY,
  ).toString(CryptoJS.enc.Utf8);

  // Parse decrypted data back to JSON
  return JSON.parse(decryptedData);
};

export const getLocale = (code: string) => {
  switch (code) {
    case 'en':
      return 'en-US';

    case 'hi':
      return 'hi-IN';

    case 'mr':
      return 'mr-IN';

    case 'ta':
      return 'ta-IN';

    case 'bn':
      return 'bn-IN';
  }
};

export const compareIgnoringSpaces = (str1: string, str2: string) => {
  // Remove all spaces from the strings
  const cleanedStr1 = str1.replace(/\s+/g, '');
  const cleanedStr2 = str2.replace(/\s+/g, '');

  // Compare the cleaned strings
  return cleanedStr1 === cleanedStr2;
};

export const calculateDistance = (
  list: any,
  location: {latitude: number; longitude: number},
) => {
  return list.map((item: any) => {
    const latLong = item.gps.split(/\s*,\s*/);
    const distance =
      getDistance(location, {
        latitude: latLong[0],
        longitude: latLong[1],
      }) / 1000;
    const distanceString = Number.isInteger(distance)
      ? String(distance)
      : distance.toFixed(1);
    return {...item, ...{distance: distanceString}};
  });
};

export const calculateDistanceBetweenPoints = (
  firstPoint: {latitude: number; longitude: number},
  secondPoint: {latitude: number; longitude: number},
) => {
  const distance = getDistance(firstPoint, secondPoint) / 1000;
  return Number.isInteger(distance) ? String(distance) : distance.toFixed(1);
};
