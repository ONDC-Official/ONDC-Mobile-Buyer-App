import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';

interface StockAvailability {
  available: boolean;
}

const StockAvailability: React.FC<StockAvailability> = ({available}) => {
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);

  return available ? (
    <View style={styles.stockRow}>
      <Icon name={'check'} color={colors.success} size={16} />
      <Text variant={'bodyMedium'} style={styles.inStockLabel}>
        In stock
      </Text>
    </View>
  ) : (
    <View style={styles.stockRow}>
      <MaterialCommunityIcons
        name={'close-circle-outline'}
        color={colors.error}
        size={16}
      />
      <Text variant={'bodyMedium'} style={styles.outOfStockLabel}>
        Out of stock
      </Text>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    stockRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    inStockLabel: {
      color: colors.success,
      marginLeft: 6,
    },
    outOfStockLabel: {
      color: colors.error,
      marginLeft: 6,
    },
  });

export default StockAvailability;
