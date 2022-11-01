import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, withTheme } from 'react-native-elements';

const Chip = ({ name, color, backgroundColor }) => {
  return (
    <View
      style={[
        styles.chipContainer,
        { backgroundColor: backgroundColor, borderColor: color },
      ]}>
      <Text style={[styles.text, { color: color }]}>{name}</Text>
    </View>
  );
};

const StatusContainer = ({ product, theme }) => {
  const { colors } = theme;

  return (
    <View style={styles.container}>
      {product.return_status ? (
        <Chip
          name={product.return_status}
          color={colors.accentColor}
          backgroundColor={colors.statusBackground}
        />
      ) : (
        <>
          {product.product['@ondc/org/returnable'] && (
            <Chip
              name={'Returnable'}
              color={colors.grey3}
              backgroundColor={colors.disabled}
            />
          )}
        </>
      )}

      {product.cancellation_status ? (
        <View style={styles.cancellContainer}>
          <Chip
            name={product.cancellation_status}
            color={colors.accentColor}
            backgroundColor={colors.statusBackground}
          />
        </View>
      ) : (
        <>
          {product.product['@ondc/org/cancellable'] && (
            <View style={styles.cancellContainer}>
              <Chip
                name={'Cancellable'}
                color={colors.grey3}
                backgroundColor={colors.disabled}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default withTheme(StatusContainer);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  cancellContainer: { paddingHorizontal: 10 },
  text: { fontWeight: '700' },
  chipContainer: {
    paddingVertical: 5,
    borderRadius: 15,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
});
