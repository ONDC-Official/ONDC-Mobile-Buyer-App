import React, {useEffect, useState} from 'react';
import {Card, Divider, Text, withTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

const CallSeller = ({
  route: {
    params: {items},
  },
}) => {
  const [providerList, setProviderList] = useState([]);

  useEffect(() => {
    items.forEach(element => {
      const provider = providerList.find(
        peoviderElement =>
          peoviderElement.id === element.product?.provider_details?.id,
      );
      if (!provider) {
        const contact_details_consumer_care =
          element.product.hasOwnProperty(
            '@ondc/org/contact_details_consumer_care',
          ) && element.product['@ondc/org/contact_details_consumer_care'];
        providerList.push({
          ...element.product?.provider_details,
          contact_details_consumer_care,
        });
      }
    });
    setProviderList([...providerList]);
  }, [items]);

  return (
    <Card style={styles.card}>
      {providerList?.map(item => (
        <>
          <View key={item.id} style={styles.row}>
            <Text variant="titleMedium">{item?.descriptor?.name}</Text>
            <Text>
              Contact Details:&nbsp;
              {item?.hasOwnProperty('contact_details_consumer_care')
                ? item.contact_details_consumer_care
                : 'N/A'}
            </Text>
          </View>
          <Divider />
        </>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  row: {marginTop: 8, paddingBottom: 8},
  card: {
    backgroundColor: 'white',
    margin: 8,
    padding: 8,
  },
});

export default withTheme(CallSeller);
