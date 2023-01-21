import moment from 'moment';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {appStyles} from '../../../../styles/styles';
import {Text, withTheme} from 'react-native-paper';
import OrderStatus from './OrderStatus';

/**
 * Component to render single card on orders screen
 * @param theme:application theme
 * @param item:single order object
 * @constructor
 * @returns {JSX.Element}
 */
const OrderHeader = ({item, theme}) => {
  const {colors} = theme;

  return (
    <View style={styles.container}>
      <View style={appStyles.container}>
        <Text numberOfLines={1} style={styles.itemName}>
          Order id:&nbsp;{item.id ? item.id : 'NA'}
        </Text>
        <Text style={{color: colors.grey}}>
          Ordered on&nbsp;
          {moment(item.createdAt).format('Do MMMM YYYY')}
        </Text>
      </View>
      {item.state && <OrderStatus status={item.state} />}
    </View>
  );
};

export default withTheme(OrderHeader);

const styles = StyleSheet.create({
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {fontSize: 16, fontWeight: 'bold'},
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatus: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginLeft: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 15,
  },
});
