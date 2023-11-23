import { Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import React from "react";

const Address = ({ name, email, title, phone, address }) => {
  return (
    <View style={styles.addressContainer}>
      <Text>{title}</Text>
      <Text variant="titleMedium">{name}</Text>
      <Text style={styles.address}>{email}</Text>
      <Text style={styles.address}>{phone}</Text>
      <Text style={styles.address}>
        {address?.street}, {address?.landmark ? `${address?.landmark},` : ""}
        {address?.city}, {address?.state}
      </Text>
      <Text style={styles.address}>
        {address?.areaCode ? address?.areaCode : null}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  addressContainer: { paddingHorizontal: 12, marginTop: 20, flexShrink: 1 },
  address: { marginBottom: 4 },
});

export default Address;
