import {Dimensions, Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import {ToastPosition} from 'react-native-toast-message/lib/src/types';

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
  numberOfLines: number = 1,
) => {
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

export const createCustomizationAndGroupMapping = (customizations: any[]) => {
  let newCustomizationGroupMappings = {};
  let customizationToGroupMap = {};
  customizations.forEach((customization: any) => {
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

  const finalizedCustomizationGroupMappings = {};
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
