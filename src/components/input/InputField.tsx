import React from 'react';
import {HelperText, Text, TextInput} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {useAppTheme} from '../../utils/theme';

/**
 * Component to render generic input field
 * @param theme: theme object
 * @param props: other props
 * @returns {JSX.Element}
 * @constructor
 */
const InputField: React.FC<any> = ({inputLabel, ...props}) => {
  const theme = useAppTheme();
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
  });

export default InputField;
