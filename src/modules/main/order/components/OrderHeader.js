import moment from "moment";
import React from "react";
import { StyleSheet, View } from "react-native";
import { appStyles } from "../../../../styles/styles";
import { Card, Text, withTheme } from "react-native-paper";
import OrderStatus from "./OrderStatus";
import { useNavigation } from "@react-navigation/native";

/**
 * Component to render single card on orders screen
 * @param theme:application theme
 * @param item:single order object
 * @constructor
 * @returns {JSX.Element}
 */
const OrderHeader = ({ item, theme }) => {
  const { colors } = theme;
  const navigation = useNavigation();

  item.state = item.items?.every(
    element => element.cancellation_status === "Cancelled",
  )
    ? "Cancelled"
    : item.state;

  return (
    <Card
      style={styles.container}
      onPress={() => navigation.navigate("OrderDetails", { order: item })}>
      <View style={styles.row}>
        <View style={appStyles.container}>
          <Text numberOfLines={1} variant="titleMedium">
            Order id:&nbsp;{item.id ? item.id : "NA"}
          </Text>
          <Text style={{ color: colors.grey }}>
            Ordered on&nbsp;
            {moment(item.createdAt).format("Do MMMM YYYY")}
          </Text>
        </View>
        <View>{item.state && <OrderStatus status={item.state} />}</View>
      </View>
    </Card>
  );
};

export default withTheme(OrderHeader);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
  container: {
    margin: 8,
    backgroundColor: "white",
  },
});
