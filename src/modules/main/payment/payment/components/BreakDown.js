import {Card, Divider, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import React from 'react';

const BreakDown = ({products}) => {
  return (
    <Card style={styles.card}>
      {products.map(product => {
        return (
          <View key={product.id}>
            {product.hasOwnProperty('items') ? (
              product.items.map(item => (
                <View
                  key={`${item['@ondc/org/item_id']}Item`}
                  style={styles.priceContainer}>
                  <Text style={styles.price}>{item.title}</Text>
                  <Text variant="titleSmall" style={styles.productPrice}>
                    ₹{item.price.value}
                  </Text>
                </View>
              ))
            ) : (
              <></>
            )}
            {product.hasOwnProperty('discounts') &&
              product.discounts.map(item => (
                <View
                  key={`${item['@ondc/org/item_id']}Discount`}
                  style={styles.priceContainer}>
                  <Text style={styles.price}>{item.title}</Text>
                  <Text variant="titleSmall" style={styles.productPrice}>
                    ₹{item.price.value}
                  </Text>
                </View>
              ))}
            {product.hasOwnProperty('taxes') &&
              product.taxes.map(item => (
                <View
                  key={`${item['@ondc/org/item_id']}Tax`}
                  style={styles.priceContainer}>
                  <Text style={styles.price}>{item.title}</Text>
                  <Text variant="titleSmall" style={styles.productPrice}>
                    ₹{item.price.value}
                  </Text>
                </View>
              ))}
            {product.hasOwnProperty('packings') &&
              product.packings.map(item => (
                <View
                  key={`${item['@ondc/org/item_id']}Packing`}
                  style={styles.priceContainer}>
                  <Text style={styles.price}>{item.title}</Text>
                  <Text variant="titleSmall" style={styles.productPrice}>
                    ₹{item.price.value}
                  </Text>
                </View>
              ))}
            {product.hasOwnProperty('deliveries') &&
              product.deliveries.map(item => (
                <View
                  key={`${item['@ondc/org/item_id']}Delivery`}
                  style={styles.priceContainer}>
                  <Text style={styles.price}>{item.title}</Text>
                  <Text variant="titleSmall" style={styles.productPrice}>
                    ₹{item.price.value}
                  </Text>
                </View>
              ))}
            {product.hasOwnProperty('misces') &&
              product.misces.map(item => (
                <View
                  key={`${item['@ondc/org/item_id']}misc`}
                  style={styles.priceContainer}>
                  <Text style={styles.price}>{item.title}</Text>
                  <Text variant="titleSmall" style={styles.productPrice}>
                    ₹{item.price.value}
                  </Text>
                </View>
              ))}
            <Divider />
          </View>
        );
      })}
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

export default BreakDown;
