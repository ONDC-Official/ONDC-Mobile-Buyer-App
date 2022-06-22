import moment from 'moment';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import {appStyles} from '../../../styles/styles';

/**
 * Component to render single card on orders screen
 * @param theme:application theme
 * @param item:single order object
 * @constructor
 * @returns {JSX.Element}
 */
const OrderCard = ({item, theme}) => {
  const {colors} = theme;

  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={appStyles.container}>
        <Text numberOfLines={1} style={styles.itemName}>
          {item.id ? item.id : t('main.order.na')}
        </Text>
        <Text style={{color: colors.grey}}>
          {t('main.order.ordered_on_label')}
          {moment(item.updatedAt).format('Do MMMM YYYY')}
        </Text>
      </View>

      <View
        style={[
          styles.orderStatus,
          {
            borderColor: colors.accentColor,
            backgroundColor: colors.statusBackground,
          },
        ]}>
        <Text style={{color: colors.accentColor}}>
          {t('main.order.pending')}
        </Text>
      </View>
    </View>
  );
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
    marginLeft: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 15,
  },
});
