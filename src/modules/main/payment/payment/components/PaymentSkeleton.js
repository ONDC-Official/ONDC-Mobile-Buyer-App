import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Divider } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

/**
 * Component to show skeleton of payment screen
 * @returns {JSX.Element}
 */
const PaymentSkeleton = () => (
  <>
    <Card style={styles.card}>
      <SkeletonPlaceholder>
        <View style={styles.items}>
          <View style={styles.title} />
          <View style={styles.price} />
        </View>
      </SkeletonPlaceholder>
      <Divider />
      <SkeletonPlaceholder>
        <View style={styles.items}>
          <View style={styles.title} />
          <View style={styles.price} />
        </View>
      </SkeletonPlaceholder>
      <Divider />
      <SkeletonPlaceholder>
        <View style={styles.items}>
          <View style={styles.title} />
          <View style={styles.price} />
        </View>
      </SkeletonPlaceholder>
    </Card>
    <Card style={styles.card}>
      <SkeletonPlaceholder>
        <View style={styles.heading} />
        <View style={styles.address} />
      </SkeletonPlaceholder>
    </Card>
    <Card style={styles.card}>
      <SkeletonPlaceholder>
        <View style={styles.heading} />
      </SkeletonPlaceholder>
      <SkeletonPlaceholder>
        <View style={styles.paymentOption}>
          <View style={styles.radioButton} />
          <View style={styles.label} />
        </View>
      </SkeletonPlaceholder>
      <SkeletonPlaceholder>
        <View style={styles.paymentOption}>
          <View style={styles.radioButton} />
          <View style={styles.label} />
        </View>
      </SkeletonPlaceholder>
    </Card>
    <SkeletonPlaceholder>
      <View style={styles.button} />
    </SkeletonPlaceholder>
  </>
);

export default PaymentSkeleton;

const styles = StyleSheet.create({
  heading: {
    height: 20,
    width: 100,
    marginBottom: 10,
  },
  address: { height: 15, width: 300, marginTop: 10 },
  paymentOption: { flexDirection: "row", marginBottom: 10, alignItems: "center" },
  radioButton: { height: 20, width: 20, borderRadius: 20, marginRight: 20 },
  label: { height: 15, width: 200 },
  button: { height: 30, width: 300, marginVertical: 30, alignSelf: "center" },
  items: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  title: { height: 15, width: 150 },
  price: { height: 15, width: 50 },
  card: {
    margin: 8,
    padding: 8,
    backgroundColor: "white",
  },
});
