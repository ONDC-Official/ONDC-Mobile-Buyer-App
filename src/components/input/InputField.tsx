import React from 'react';
import {HelperText, Text, TextInput, withTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

/**
 * Component to render generic input field
 * @param theme: theme object
 * @param props: other props
 * @returns {JSX.Element}
 * @constructor
 */
const InputField: React.FC<any> = ({inputLabel, theme, ...props}) => {
  const styles = makeStyles(theme.colors);

  return (
    <View>
      <Text variant={'bodySmall'} style={styles.inputLabel}>
        {inputLabel}
      </Text>
      <TextInput
        {...props}
        mode="outlined"
        dense
        outlineStyle={styles.outline}
        placeholderTextColor={'#B5B5B5'}
        outlineColor={'#B5B5B5'}
      />
      {props.error && (
        <HelperText padding="none" type="error" visible={props.error}>
          {props.errorMessage}
        </HelperText>
      )}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    inputLabel: {
      color: '#1A1A1A',
      marginBottom: 4,
    },
    outline: {
      borderRadius: 12,
    },
  });

export default withTheme(InputField);
