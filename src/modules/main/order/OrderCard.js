import moment from 'moment';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import {strings} from '../../../locales/i18n';

const orderedOn = strings('main.order.ordered_on_label');

const OrderCard = ({item, theme}) => {
  const {colors} = theme;

  return item.quote ? (
    <>
      <Text numberOfLines={1} style={styles.itemName}>
        {item.quote.breakup[0].title}
      </Text>
      <View style={styles.container}>
        <Text style={{color: colors.grey}}>
          {orderedOn} {moment(item.updatedAt).format('LL')}
        </Text>
        <Text style={styles.price}>₹ {item.quote.price.value}</Text>
      </View>
    </>
  ) : null;
};

export default withTheme(OrderCard);

const styles = StyleSheet.create({
  itemName: {
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {fontSize: 16, fontWeight: 'bold'},
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
