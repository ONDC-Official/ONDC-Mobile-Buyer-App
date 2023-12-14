import {StyleSheet, View} from 'react-native';
import {Button, RadioButton, Text, useTheme} from 'react-native-paper';
import React from 'react';

interface Fulfillment {
  selectedFulfillment: any;
  setSelectedFulfillment: (newValue: any) => void;
  cartItems: any[];
  setCurrentStep: (step: number) => void;
  currentStep: number;
}

const Fulfillment: React.FC<Fulfillment> = ({
  selectedFulfillment,
  setSelectedFulfillment,
  cartItems,
  setCurrentStep,
  currentStep,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.listContainer}>
      <RadioButton.Group
        value={selectedFulfillment}
        onValueChange={newValue => setSelectedFulfillment(newValue)}>
        {cartItems[0]?.message?.quote?.fulfillments?.map((fulfillment: any) => (
          <View key={fulfillment.id} style={styles.customerRow}>
            <RadioButton.Android value={fulfillment.id} />
            <Text style={styles.customerMeta}>
              {fulfillment['@ondc/org/category']}
            </Text>
          </View>
        ))}
      </RadioButton.Group>
      <Button
        mode={'contained'}
        onPress={() => setCurrentStep(currentStep + 1)}>
        Continue
      </Button>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    listContainer: {
      padding: 16,
      backgroundColor: '#F9F9F9',
    },
    customerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    customerMeta: {
      marginLeft: 12,
    },
  });

export default Fulfillment;
