import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Card, withTheme} from 'react-native-elements';
import OrderCard from './OrderCard';
import ShippingDetails from './ShippingDetails';

/**
 * Component is used to display accordion card on order screen
 * @param theme: application theme
 * @param item:single accordion card in the list
 * @param getOrderList:function to request order list
 * @returns {JSX.Element}
 * @constructor
 */
const OrderAccordion = ({item, theme, getOrderList}) => {
  const [activeSections, setActiveSections] = useState([]);

  const renderContent = section => {
    const isActive = activeSections.find(one => one === section.id);

    return isActive ? (
      <ShippingDetails order={section} getOrderList={getOrderList} />
    ) : null;
  };

  const onPressHandler = section => {
    const isActive = activeSections.findIndex(one => one === item.id);
    if (isActive > -1) {
      let newArray = activeSections.slice();
      newArray.splice(isActive, 1);
      setActiveSections(newArray);
    } else {
      let newArray = activeSections.slice();
      newArray.push(section.id);
      setActiveSections(newArray);
    }
  };

  return (
    <Card containerStyle={styles.card}>
      <TouchableOpacity onPress={() => onPressHandler(item)}>
        <OrderCard item={item} />
      </TouchableOpacity>
      {renderContent(item)}
    </Card>
  );
};

export default withTheme(OrderAccordion);

const styles = StyleSheet.create({
  card: {borderRadius: 15, elevation: 4},
});
