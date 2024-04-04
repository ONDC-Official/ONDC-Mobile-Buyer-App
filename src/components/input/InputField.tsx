import React from 'react';
import {HelperText, Text, TextInput} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {useAppTheme} from '../../utils/theme';

/**
 * Component to render generic input field
 * @param inputLabel
 * @param props: other props
 * @returns {JSX.Element}
 * @constructor
 */
const InputField: React.FC<any> = ({inputLabel, ...props}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View>
      <Text variant={'bodyMedium'} style={styles.inputLabel}>
        {inputLabel}
        {props.required && <Text>*</Text>}
      </Text>
      <TextInput
        {...props}
        mode="outlined"
        dense
        style={styles.inputText}
        outlineStyle={styles.outline}
        placeholderTextColor={theme.colors.neutral200}
        outlineColor={theme.colors.neutral200}
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
      color: colors.neutral400,
      marginBottom: 4,
    },
    outline: {
      borderRadius: 12,
    },
    inputText: {
      fontWeight: '400',
      backgroundColor: colors.white,
    },
  });

export default InputField;
