import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, withTheme} from 'react-native-paper';

import OrderHeader from './OrderHeader';
import ShippingDetails from './ShippingDetails';

/**
 * Component is used to display accordion card on order screen
 * @param theme: application theme
 * @param item:single accordion card in the list
 * @param getOrderList:function to request order list
 * @returns {JSX.Element}
 * @constructor
 */
const OrderAccordion = ({item, getOrderList}) => {
  const [expand, setExpand] = useState(false);

  return (
    <View style={styles.container}>
      <Card>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => setExpand(!expand)}>
            <OrderHeader item={item} />
          </TouchableOpacity>
          {expand && (
            <ShippingDetails order={item} getOrderList={getOrderList} />
          )}
        </View>
      </Card>
    </View>
  );
};

export default withTheme(OrderAccordion);

const styles = StyleSheet.create({
  container: {margin: 10},
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
});
