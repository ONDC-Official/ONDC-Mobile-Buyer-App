import React, { useEffect } from "react";
import ShippingDetails from "./components/ShippingDetails";

const OrderDetails = ({ route: { params }, navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Order Id: ${params.order.id ? params.order.id : "NA"}`,
    });
  }, [navigation]);

  return <ShippingDetails order={params.order} />;
};

export default OrderDetails;
