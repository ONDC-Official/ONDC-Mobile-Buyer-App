import AsyncStorage from '@react-native-async-storage/async-storage';

export const removeData = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

export const getStoredData = async (key: string) => {
  return await AsyncStorage.getItem(key);
};

export const setStoredData = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
};

export const clearAll = async () => {
  await AsyncStorage.clear();
};

export const clearMultiple = async (keys: string[]) => {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (e) {
    throw e;
  }
};

export const saveMultipleData = async (data: any) => {
  try {
    await AsyncStorage.multiSet(data);
    return true;
  } catch (e) {
    throw e;
  }
};

export const getMultipleData = async (keys: any) => {
  try {
    return await AsyncStorage.multiGet(keys);
  } catch (e) {
    throw e;
  }
};
