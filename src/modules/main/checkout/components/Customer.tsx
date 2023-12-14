import {StyleSheet, View} from 'react-native';
import {Avatar, Button, Text, useTheme} from 'react-native-paper';
import React from 'react';
import {useSelector} from 'react-redux';
import {getInitials} from '../../../../utils/utils';

interface Customer {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const Customer: React.FC<Customer> = ({currentStep, setCurrentStep}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const {address} = useSelector(({addressReducer}) => addressReducer);

  return (
    <View style={styles.listContainer}>
      <View style={styles.customerRow}>
        <Avatar.Text size={36} label={getInitials(address?.descriptor?.name)} />
        <View style={styles.customerMeta}>
          <Text variant={'titleSmall'}>{address?.descriptor?.name}</Text>
          <Text variant={'bodyLarge'}>{address?.descriptor?.email}</Text>
        </View>
      </View>
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

export default Customer;
