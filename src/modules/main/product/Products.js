import React, {useEffect} from 'react';
import {View} from 'react-native';
import Config from 'react-native-config';
import {getData, postData} from '../../../utils/api';

const Products = () => {
  const addLocation = async () => {
    try {
      const {data} = await postData(Config.GET_TOKEN, {});
      const locationResponse = await getData(
        `${Config.GET_LOCATION}address=bhatia&itemCount=10`,
        {
          headers: {
            Authorization: 'Bearer' + ' ' + data.access_token,
          },
        },
      );
      console.log(locationResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    addLocation();
  }, []);

  return <View />;
};

export default Products;
