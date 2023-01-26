import React from 'react';
import {Card, Divider, Text, withTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

const CallSeller = ({
  route: {
    params: {items},
  },
}) => {
    return (
      <Card style={styles.card}>
        {items?.map(item => (
          <>
            <View key={item.id} style={styles.row}>
              <Text variant="titleMedium">{item?.product?.descriptor?.name}</Text>
              <Text>Contact Details:&nbsp;{item?.product?.hasOwnProperty('@ondc/org/contact_details_consumer_care') ? item?.product['@ondc/org/contact_details_consumer_care'] : 'N/A'}</Text>
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
