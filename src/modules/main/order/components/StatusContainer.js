import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Chip, withTheme} from 'react-native-paper';

const StatusContainer = ({product, theme}) => {
  return (
    <View style={styles.container}>
      {product.return_status ? (
        <Chip selectedColor={theme.colors.primary} mode="outlined">
          {product.return_status}
        </Chip>
      ) : (
        <>
          {product.product['@ondc/org/returnable'] && (
            <Chip selectedColor={theme.colors.primary} mode="outlined">
              Returnable
            </Chip>
          )}
        </>
      )}

      {product.cancellation_status ? (
        <View style={styles.cancelContainer}>
          <Chip selectedColor={theme.colors.primary} mode="outlined">
            {product.cancellation_status}
          </Chip>
        </View>
      ) : (
        <>
          {product.product['@ondc/org/cancellable'] && (
            <View style={styles.cancelContainer}>
              <Chip selectedColor={theme.colors.primary} mode="outlined">
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
  cancelContainer: {paddingHorizontal: 10},
});
