import {Card, Divider, Text, withTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {stringToDecimal} from '../../../../../utils/utils';

const BreakDown = ({providers, theme}) => {
  let orderTotal = 0;
  return (
    <Card style={styles.card}>
      {providers.map(provider => {
        let total = 0;
        return (
          <>
            <View key={provider?.provider?.id}>
              <Text variant="titleMedium" style={{marginTop: 8}}>
                {provider?.provider?.descriptor?.name}
              </Text>
              {provider.items.map(product => {
                return (
                  <View key={product.id}>
                    {product.hasOwnProperty('items') ? (
                      product.items.map(item => {
                        const price = stringToDecimal(item.price.value);
                        total += price;
                        orderTotal += price;
                        return (
                          <View key={`${item['@ondc/org/item_id']}Item`}>
                            <View style={styles.priceContainer}>
                              <Text style={styles.price}>{item.title}</Text>
                              <Text
                                variant="titleSmall"
                                style={styles.productPrice}>
                                ₹{stringToDecimal(item.price.value)}
                              </Text>
                            </View>
                            {item.hasOwnProperty('@ondc/org/item_quantity') && (
                              <Text>
                                Qt: {item['@ondc/org/item_quantity'].count} *{' '}
                                {stringToDecimal(item.item.price.value)}
                              </Text>
                            )}
                          </View>
                        );
                      })
                    ) : (
                      <></>
                    )}
                    {product.hasOwnProperty('discounts') &&
                      product.discounts.map(item => {
                        const price = stringToDecimal(item.price.value);
                        total += price;
                        orderTotal += price;
                        return (
                          <View
                            key={`${item['@ondc/org/item_id']}Discount`}
                            style={styles.priceContainer}>
                            <Text style={styles.price}>{item.title}</Text>
                            <Text
                              variant="titleSmall"
                              style={styles.productPrice}>
                              ₹{item.price.value}
                            </Text>
                          </View>
                        );
                      })}
                    {product.hasOwnProperty('taxes') &&
                      product.taxes.map(item => {
                        const price = stringToDecimal(item.price.value);
                        total += price;
                        orderTotal += price;
                        return (
                          <View
                            key={`${item['@ondc/org/item_id']}Tax`}
                            style={styles.priceContainer}>
                            <Text style={styles.price}>{item.title}</Text>
                            <Text
                              variant="titleSmall"
                              style={styles.productPrice}>
                              ₹{item.price.value}
                            </Text>
                          </View>
                        );
                      })}
                    {product.hasOwnProperty('packings') &&
                      product.packings.map(item => {
                        const price = stringToDecimal(item.price.value);
                        total += price;
                        orderTotal += price;
                        return (
                          <View
                            key={`${item['@ondc/org/item_id']}Packing`}
                            style={styles.priceContainer}>
                            <Text style={styles.price}>{item.title}</Text>
                            <Text
                              variant="titleSmall"
                              style={styles.productPrice}>
                              ₹{item.price.value}
                            </Text>
                          </View>
                        );
                      })}
                    {product.hasOwnProperty('deliveries') &&
                      product.deliveries.map(item => {
                        const price = stringToDecimal(item.price.value);
                        total += price;
                        orderTotal += price;
                        return (
                          <View
                            key={`${item['@ondc/org/item_id']}Delivery`}
                            style={styles.priceContainer}>
                            <Text style={styles.price}>{item.title}</Text>
                            <Text
                              variant="titleSmall"
                              style={styles.productPrice}>
                              ₹{item.price.value}
                            </Text>
                          </View>
                        );
                      })}
                    {product.hasOwnProperty('misces') &&
                      product.misces.map(item => {
                        const price = stringToDecimal(item.price.value);
                        total += price;
                        orderTotal += price;
                        return (
                          <View
                            key={`${item['@ondc/org/item_id']}misc`}
                            style={styles.priceContainer}>
                            <Text style={styles.price}>{item.title}</Text>
                            <Text
                              variant="titleSmall"
                              style={styles.productPrice}>
                              ₹{item.price.value}
                            </Text>
                          </View>
                        );
                      })}
                  </View>
                );
              })}
              <View style={styles.priceContainer}>
                <Text
                  variant="titleSmall"
                  style={{color: theme.colors.opposite}}>
                  Total
                </Text>
                <Text
                  variant="titleSmall"
                  style={{color: theme.colors.opposite}}>
                  ₹{total}
                </Text>
              </View>
              <Divider bold />
            </View>
          </>
        );
      })}
      <View style={styles.priceContainer}>
        <Text variant="titleMedium" style={{color: theme.colors.opposite}}>
          Order Total
        </Text>
        <Text variant="titleMedium" style={{color: theme.colors.opposite}}>
          ₹{orderTotal}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 8,
    margin: 8,
  },
  priceContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  price: {flexShrink: 1},
  productPrice: {
    width: 70,
    textAlign: 'right',
  },
});

export default withTheme(BreakDown);
