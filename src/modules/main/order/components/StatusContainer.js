import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Chip, withTheme} from 'react-native-paper';

const StatusContainer = ({product, theme}) => {
  if (product.hasOwnProperty('return_status')) {
    return (
      <View style={styles.container}>
        <View style={styles.chipContainer}>
          <Chip selectedColor={theme.colors.red} mode="flat">
            {product.return_status === 'Return_Initialted'
              ? 'Return Initiated'
              : product.return_status}
          </Chip>
        </View>
      </View>
    );
  } else if (product.hasOwnProperty('cancellation_status')) {
    return (
      <View style={styles.container}>
        <View style={styles.chipContainer}>
          <Chip selectedColor={theme.colors.red} mode="flat">
            {product.cancellation_status}
          </Chip>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {product.product.hasOwnProperty('@ondc/org/returnable') && (
          <View style={styles.chipContainer}>
            {product.product['@ondc/org/returnable'] ? (
              <Chip
                selectedColor={theme.colors.primary}
                mode="flat"
                style={styles.chipStyle}
                textStyle={styles.chipTextStyle}>
                Returnable
              </Chip>
            ) : (
              <Chip
                selectedColor={theme.colors.error}
                mode="flat"
                style={styles.chipStyle}
                textStyle={styles.chipTextStyle}>
                Non-Returnable
              </Chip>
            )}
          </View>
        )}
        {product.product.hasOwnProperty('@ondc/org/cancellable') && (
          <View style={styles.chipContainer}>
            {product.product['@ondc/org/cancellable'] ? (
              <Chip
                selectedColor={theme.colors.primary}
                mode="flat"
                style={styles.chipStyle}>
                Cancellable
              </Chip>
            ) : (
              <Chip
                selectedColor={theme.colors.error}
                mode="flat"
                compact
                style={styles.chipStyle}
                textStyle={styles.chipTextStyle}>
                Non-Cancellable
              </Chip>
            )}
          </View>
        )}
      </View>
    );
  }
};

export default withTheme(StatusContainer);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 10,
  },
  chipContainer: {paddingEnd: 5},
  chipStyle: {
    width: 122,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  chipTextStyle: {
    marginLeft: 8,
    marginRight: 8,
    minWidth: 105,
    fontSize: 13,
    textAlign: 'center',
  },
});
