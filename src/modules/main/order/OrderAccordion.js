import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import {Card, withTheme} from 'react-native-elements';
import OrderCard from './OrderCard';
import ShippingDetails from './ShippingDetails';

const OrderAccordion = ({item, theme, getOrderList}) => {
  const {colors} = theme;
  const [activeSections, setActiveSections] = useState([]);

  const _renderHeader = sections => <OrderCard item={sections} />;

  const _renderContent = sections => (
    <ShippingDetails order={sections} getOrderList={getOrderList} />
  );

  const _updateSections = activesections => setActiveSections(activesections);

  return item.id && item.quote ? (
    <Card containerStyle={styles.card}>
      <Accordion
        sections={[item]}
        activeSections={activeSections}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={_updateSections}
        underlayColor={colors.white}
        keyExtractor={(item, index) => index.toString()}
      />
    </Card>
  ) : null;
};

export default withTheme(OrderAccordion);

const styles = StyleSheet.create({
  card: {borderRadius: 15, elevation: 4},
});
