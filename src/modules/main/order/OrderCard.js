import moment from 'moment';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import {strings} from '../../../locales/i18n';

const orderedOn = strings('main.order.ordered_on_label');

/**
 * Component to render signle card on orders screen
 * @param theme:application theme
 * @param item:single order object
 * @constructor
 * @returns {JSX.Element}
 */
const OrderCard = ({item, theme}) => {
  const {colors} = theme;

  return item.id ? (
    <>
      <View style={styles.container}>
        <View>
          <Text numberOfLines={1} style={styles.itemName}>
            {item.id}
          </Text>
          <Text style={{color: colors.grey}}>
            {orderedOn}
            {moment(item.updatedAt).format('Do MMMM YYYY')}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <Text>Status:</Text>
          <View
            style={[
              styles.orderStatus,
              {
                borderColor: colors.accentColor,
                backgroundColor: colors.statusBackground,
              },
            ]}>
            <Text style={{color: colors.accentColor}}>Pending</Text>
          </View>
        </View>
      </View>
    </>
  ) : null;
};

export default withTheme(OrderCard);

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
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 15,
  },
  statusContainer: {alignItems: 'center'},
});
