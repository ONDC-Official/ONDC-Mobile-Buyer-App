import React, {useState} from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import OrderCard from './OrderCard';
import {Card, Text, withTheme} from 'react-native-elements';
import {StyleSheet} from 'react-native';
import ShippingDetails from './ShippingDetails';

const OrderAccordion = ({item, theme}) => {
  const {colors} = theme;
  const [activeSections, setActiveSections] = useState([]);

  const _renderHeader = sections => <OrderCard item={sections} />;

  const _renderContent = sections => <ShippingDetails item={sections} />;

  const _updateSections = activesections => setActiveSections(activesections);

  return item.quote ? (
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
