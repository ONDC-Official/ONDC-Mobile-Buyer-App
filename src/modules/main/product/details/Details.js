import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';

//TODO: i18n missing
//TODO: Why we are using inline styling here?
const Details = ({item}) => {
  return (
    <View style={{padding: 10}}>
      <Text style={{fontSize: 18, fontWeight: '700', marginBottom: 8}}>
        Product Details
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{marginRight: 30}}>
          <Text style={{fontSize: 16, marginBottom: 4}}>Id</Text>
          <Text style={{fontSize: 16, marginBottom: 4}}>Name</Text>
          <Text style={{fontSize: 16, marginBottom: 4}}>Bpp Id</Text>
          <Text style={{fontSize: 16, marginBottom: 4}}>Provider</Text>
        </View>
        <View>
          <Text style={{fontSize: 16, marginBottom: 4}}>{item.id}</Text>
          <Text style={{fontSize: 16, marginBottom: 4}}>
            {item.descriptor.name}
          </Text>
          <Text style={{fontSize: 16, marginBottom: 4}}>
            {item.bpp_details.bpp_id}
          </Text>
          <Text style={{fontSize: 16, marginBottom: 4}}>
            {item.provider_details.descriptor.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Details;
