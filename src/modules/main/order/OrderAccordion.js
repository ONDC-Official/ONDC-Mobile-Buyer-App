import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import {Card, withTheme} from 'react-native-elements';
import {keyExtractor} from '../../../utils/utils';
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
  const {colors} = theme;
  const [activeSections, setActiveSections] = useState([]);

  const _renderHeader = sections => <OrderCard item={sections}/>;

  const _renderContent = sections => (
    <ShippingDetails order={sections} getOrderList={getOrderList}/>
  );

  const _updateSections = activesections => setActiveSections(activesections);

  return (
    <Card containerStyle={styles.card}>
      <Accordion
        sections={[item]}
        activeSections={activeSections}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
        underlayColor={colors.white}
        keyExtractor={keyExtractor}
      />
    </Card>
  );
};

export default withTheme(OrderAccordion);

const styles = StyleSheet.create({
  card: {borderRadius: 15, elevation: 4},
});
