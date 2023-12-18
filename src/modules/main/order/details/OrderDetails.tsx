import React, {useEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import OrderSummary from './components/OrderSummary';

const OrderDetails = ({
  route: {params},
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {colors} = useTheme();
  const {order} = params;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          size={24}
          icon={'share-variant'}
          iconColor={colors.primary}
          onPress={() =>
            navigation.navigate('AddDefaultAddress', {setDefault: false})
          }
        />
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.pageContainer}>
      <OrderSummary
        orderDetails={order}
        onUpdateOrder={() => {}}
        onUpdateTrackingDetails={() => {}}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    margin: 8,
    backgroundColor: 'white',
  },
  actionContainer: {
    paddingVertical: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  helpContainer: {
    padding: 8,
  },
  container: {
    paddingTop: 8,
  },
  rowContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  helpLabel: {
    fontSize: 18,
  },
  name: {fontSize: 18, fontWeight: '500', marginVertical: 4, flexShrink: 1},
  title: {fontSize: 16, marginRight: 10, flexShrink: 1},
  price: {fontSize: 16, marginLeft: 10},
  address: {marginBottom: 4},
  quantity: {fontWeight: '700'},
  addressContainer: {paddingHorizontal: 12, marginTop: 20, flexShrink: 1},
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
});

export default OrderDetails;
