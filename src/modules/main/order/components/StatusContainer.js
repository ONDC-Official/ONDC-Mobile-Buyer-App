import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Chip, withTheme} from 'react-native-paper';

const StatusContainer = ({product, theme}) => {
  return (
    <View style={styles.container}>
      {product.return_status ? (
        <View style={styles.chipContainer}>
          <Chip selectedColor={theme.colors.primary} mode="flat">
            {product.return_status}
          </Chip>
        </View>
      ) : (
        <View style={styles.chipContainer}>
          {product.product['@ondc/org/returnable'] && (
            <Chip selectedColor={theme.colors.primary} mode="flat">
              Returnable
            </Chip>
          )}
        </View>
      )}

      {product.cancellation_status ? (
        <View style={styles.chipContainer}>
          <Chip selectedColor={theme.colors.primary} mode="flat">
            {product.cancellation_status}
          </Chip>
        </View>
      ) : (
        <>
          {product.product['@ondc/org/cancellable'] && (
            <View style={styles.chipContainer}>
              <Chip selectedColor={theme.colors.primary} mode="flat">
                Cancellable
              </Chip>
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
    marginTop: 10,
  },
  chipContainer: {paddingEnd: 10},
});
