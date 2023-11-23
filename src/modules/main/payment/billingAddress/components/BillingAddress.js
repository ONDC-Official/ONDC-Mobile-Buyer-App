import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Card, Text, withTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

/**
 * Component to render single address card in select address screen
 * @param theme
 * @param selectedAddress:address selected by user
 * @param item:object which contains address details
 * @param onEdit:function handles click event of edit
 * @constructor
 * @returns {JSX.Element}
 */
const BillingAddress = ({ item, theme, isCurrentAddress, setBillingAddress }) => {
  const navigation = useNavigation();
  const { colors } = theme;
  const { street, landmark, city, state, areaCode } = item.address;

  return (
    <Card style={styles.card} onPress={() => setBillingAddress(item)}>
      <View style={styles.container}>
        <View style={styles.emptyCheckbox}>
          {isCurrentAddress && (
            <Icon name={"check-circle"} color={colors.primary} size={24} />
          )}
        </View>

        <View style={styles.addressContainer}>
          <View style={styles.textContainer}>
            <Text variant="titleSmall">{item?.name}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text>{item?.email}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text>{item?.phone}</Text>
          </View>
          <Text>
            {street}, {landmark ? `${landmark},` : ""} {city}, {state},{" "}
            {areaCode}
          </Text>
        </View>
        <View style={styles.editContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("UpdateBillingAddress", {
                address: item,
              })
            }>
            <Icon name="pencil-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

export default withTheme(BillingAddress);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    margin: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 8,
  },
  addressContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  emptyCheckbox: {
    width: 24,
    height: 24,
  },
  editContainer: {
    width: 24,
    height: 24,
    marginEnd: 8,
  },
  textContainer: {
    marginBottom: 8,
  },
});
