import AsyncStorage from "@react-native-async-storage/async-storage";
import { decryptData, encryptData } from "./utils";

export const removeData = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

export const getStoredData = async (key: string) => {
  const data = await AsyncStorage.getItem(key);
  if (data) {
    return decryptData(data);
  } else {
    return data;
  }
};

export const setStoredData = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, encryptData(value));
};

export const clearAll = async () => {
  await AsyncStorage.clear();
};

export const clearMultiple = async (keys: string[]) => {
  try {
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const saveMultipleData = async (data: any) => {
  try {
    const updatedData = data.map((one: any[]) => {
      one[1] = encryptData(one[1]);
      return one;
    });
    await AsyncStorage.multiSet(updatedData);
    return true;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getMultipleData = async (keys: any) => {
  try {
    const data = await AsyncStorage.multiGet(keys);
    return data.map((one: any[]) => {
      if (one[1]) {
        one[1] = decryptData(one[1]);
      }
      return one;
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};
