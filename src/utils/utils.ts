import Toast from 'react-native-toast-message';
import moment from 'moment';
import { ToastPosition } from 'react-native-toast-message/lib/src/types';
import Config from 'react-native-config';
import CryptoJS from 'crypto-js';
import { COLOR_CODE_TO_NAME } from './colorCodes';
import { CATEGORIES } from './categories';

const TOAST_VISIBILITY_TIME = 3000;

/**
 * Function is used to show toast on the screen
 * @param message
 **/
export const showToastWithGravity = (message: string) => {
  Toast.show({
    type: 'error',
    text1: message,
    position: 'top',
    visibilityTime: TOAST_VISIBILITY_TIME,
  });
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

/**
 * Check if the value is of type object
 * @param obj
 * @returns {boolean}
 */
const isObject = (obj: any) => {
  return obj != null && obj.constructor.name === 'Object';
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
  cartItems.forEach((item: any) => {
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

export const removeNullValues = (object: any) => {
  Object.entries(object).forEach(([k, v]: any) => {
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
  const { customisation_items } = product;
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

const parseDuration = (duration: number) => {
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

  const selectedTag = tags?.find((tag: any) => tag.code === 'veg_nonveg');
  const veg = selectedTag?.list?.find(
    (one: any) => one.code === 'veg' && one.value.toLowerCase() === 'yes',
  );
  if (veg) {
    category = 'veg';
  } else {
    const nonVeg = selectedTag?.list?.find(
      (one: any) => one.code === 'non_veg' && one.value.toLowerCase() === 'yes',
    );
    if (nonVeg) {
      category = 'nonveg';
    } else {
      const egg = selectedTag?.list?.find(
        (one: any) => one.code === 'egg' && one.value.toLowerCase() === 'yes',
      );
      if (egg) {
        category = 'egg';
      }
    }
  }

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

export const convertHexToName = (hex: any) => {
  const hexLowerCase = hex.toLowerCase();
  return COLOR_CODE_TO_NAME?.hasOwnProperty(hexLowerCase)
    ? COLOR_CODE_TO_NAME[hexLowerCase]
    : hex;
};

const getStartAndEndTime = (item: any) => {
  let startTime: string = '',
    endTime: string = '';
  item?.list?.forEach((element: any) => {
    if (element.code === 'time_from') {
      startTime = element?.value;
    }
    if (element.code === 'time_to') {
      endTime = element?.value;
    }
  });

  return { startTime, endTime };
};

export const getStoreTiming = (tags: any[], localId: string) => {
  let time_from: string = '';
  let time_to: string = '';

  let timings = tags?.filter((item: any) => {
    const isTiming = item.code === 'timing';
    if (isTiming) {
      const locationIndex = item.list.findIndex(
        (one: any) => one.code === 'location' && one.value === localId,
      );
      if (locationIndex > -1) {
        return true;
      }
    } else {
      return false;
    }
  });

  if (timings.length === 1) {
    const time = getStartAndEndTime(timings[0]);
    time_from = time.startTime;
    time_to = time.endTime;
  } else {
    const allTime = timings.find((time: any) => {
      return !!time.list.find(
        (item: any) => item.code === 'type' && item.value === 'ALL',
      );
    });
    if (allTime) {
      const time = getStartAndEndTime(allTime);
      time_from = time.startTime;
      time_to = time.endTime;
    } else {
      const orderTime = getTime(timings, 'Order');
      if (!orderTime) {
        const deliveryTime = getTime(timings, 'Delivery');
        if (!deliveryTime) {
          const selfPickup = getTime(timings, 'Self-Pickup');
          if (selfPickup) {
            const selfPickupDate = getStartAndEndTime(selfPickup);
            time_from = selfPickupDate.startTime;
            time_to = selfPickupDate.endTime;
          }
        } else {
          const deliveryTimeDate = getStartAndEndTime(deliveryTime);
          time_from = deliveryTimeDate.startTime;
          time_to = deliveryTimeDate.endTime;
        }
      } else {
        const orderTimeDate = getStartAndEndTime(orderTime);
        time_from = orderTimeDate.startTime;
        time_to = orderTimeDate.endTime;
      }
    }
  }
  return { time_from, time_to };
};

const filterByType = (timings: any[], type: string) => {
  return timings?.filter((time: any) => {
    return !!time.list.find(
      (item: any) => item.code === 'type' && item.value === type,
    );
  });
};

const filterByDay = (orderTimes: any[], dayOfWeek: number) => {
  return orderTimes.filter((time: any) => {
    let minValue = 999,
      maxValue = 0;
    time.list.forEach((item: any) => {
      if (item.code === 'day_from') {
        minValue = Number(item.value);
      }
      if (item.code === 'day_to') {
        maxValue = Number(item.value);
      }
    });
    return minValue <= dayOfWeek && maxValue >= dayOfWeek;
  });
};

const findByTime = (orderTimes: any[]) => {
  const currentTime = Number(moment().locale('en').format('HHmm'));
  return orderTimes.find((time: any) => {
    let minValue = 2359,
      maxValue = 0;
    time.list.forEach((item: any) => {
      if (item.code === 'time_from') {
        minValue = Number(item.value);
      }
      if (item.code === 'time_to') {
        maxValue = Number(item.value);
      }
    });
    return minValue <= currentTime && maxValue >= currentTime;
  });
};

const findNextSlotSameDay = (orderTimes: any[]) => {
  const currentTime = Number(moment().locale('en').format('HHmm'));
  return orderTimes.find((time: any) => {
    let nextTime = false;
    time.list.forEach((item: any) => {
      if (item.code === 'time_from') {
        nextTime = Number(item.value) > currentTime;
      }
    });
    return nextTime;
  });
};

const sortNextDay = (orderTimes: any[]) => {
  return orderTimes.sort((a, b) => {
    const timeFromA = a.list.find(
      (item: any) => item.code === 'time_from',
    ).value;
    const timeFromB = b.list.find(
      (item: any) => item.code === 'time_from',
    ).value;
    return Number(timeFromA) - Number(timeFromB);
  });
};

const getTime = (timings: any[], type: string) => {
  const dayOfWeek = moment().day();
  let orderTimes = filterByType(timings, type);
  let orderTimesForDay = filterByDay(orderTimes, dayOfWeek);
  const orderTime = findByTime(orderTimesForDay);
  if (orderTime) {
    return orderTime;
  } else if (orderTimes.length > 0) {
    const nextSlotForDay = findNextSlotSameDay(orderTimesForDay);
    if (nextSlotForDay) {
      return nextSlotForDay;
    } else {
      orderTimesForDay = filterByDay(orderTimes, dayOfWeek + 1);
      if (orderTimesForDay.length > 0) {
        orderTimesForDay = sortNextDay(orderTimesForDay);
        return orderTimesForDay[0];
      }
    }
  }
  return null;
};

export const getFulfilmentContact = (fulfilmentList: any[], type: string) => {
  const fulfilment = fulfilmentList.find(one => one.type === type);
  return fulfilment?.contact?.phone ?? '';
};

export const isValidQRURL = (urlParams: any) => {
  return (
    urlParams.hasOwnProperty('context.action') &&
    urlParams.hasOwnProperty('context.bpp_id') &&
    urlParams.hasOwnProperty('context.domain') &&
    urlParams.hasOwnProperty('message.intent.provider.id') &&
    urlParams['context.action'] === 'search'
  );
};

export const isDomainSupported = (domain: string) => {
  return CATEGORIES.findIndex((one: any) => one.domain === domain) > -1;
};

export const areCustomisationsSame = (
  existingIds: any[],
  currentIds: any[],
) => {
  if (existingIds.length !== currentIds.length) {
    return false;
  }

  existingIds.sort();
  currentIds.sort();

  for (let i = 0; i < existingIds.length; i++) {
    if (existingIds[i] !== currentIds[i]) {
      return false;
    }
  }

  return true;
};

export const formatCustomizationGroups = (groups: any) => {
  return groups?.map((group: any) => {
    let minConfig, maxConfig, inputTypeConfig, seqConfig;

    group?.tags?.forEach((tag: any) => {
      if (tag.code === 'config') {
        tag.list.forEach((one: any) => {
          if (one.code === 'min') {
            minConfig = one.value;
          }
          if (one.code === 'max') {
            maxConfig = one.value;
          }
          if (one.code === 'input') {
            inputTypeConfig = one.value;
          }
          if (one.code === 'seq') {
            seqConfig = one.value;
          }
        });
      }
    });

    const customization: any = {
      id: group.local_id,
      name: group.descriptor.name,
      inputType: inputTypeConfig,
      minQuantity: Number(minConfig),
      maxQuantity: Number(maxConfig),
      seq: Number(seqConfig),
    };

    if (inputTypeConfig === 'input') {
      customization.special_instructions = '';
    }

    return customization;
  });
};

export const formatCustomizations = (items: any) => {
  return items?.map((customization: any) => {
    let parent = null;
    let isDefault = false;
    let childs: any[] = [];
    let child = null;
    let vegNonVegTag: any = null;

    customization?.item_details?.tags?.forEach((tag: any) => {
      if (tag.code === 'parent') {
        tag.list.forEach((one: any) => {
          if (one.code === 'default') {
            isDefault = one.value.toLowerCase() === 'yes';
          } else if (one.code === 'id') {
            parent = one.value;
          }
        });
      } else if (tag.code === 'child') {
        tag.list.forEach((item: any) => {
          childs.push(item.value);
          if (item.code === 'id') {
            child = item.value;
          }
        });
      } else if (tag.code === 'veg_nonveg') {
        vegNonVegTag = tag;
      }
    });

    return {
      id: customization.item_details.id,
      name: customization.item_details.descriptor.name,
      price: customization.item_details.price.value,
      inStock: customization.item_details.quantity.available.count > 0,
      parent,
      child,
      childs: childs?.length > 0 ? childs : null,
      isDefault: isDefault,
      vegNonVeg: vegNonVegTag ? vegNonVegTag.list[0].code : '',
    };
  });
};
