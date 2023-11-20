import React from 'react';
import {HelperText, Text, TextInput, withTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

/**
 * Component to render generic input field
 * @param required: boolean whether input is required
 * @param label: label of input field
 * @param theme: theme object
 * @param props: other props
 * @returns {JSX.Element}
 * @constructor
 */
const InputField: React.FC<any> = ({
                                     required = false,
                                     label,
                                     theme,
                                     ...props
                                   }) => {
  const styles = makeStyles(theme.colors);

  return (
    <View>
      <TextInput
        {...props}
        mode="outlined"
        dense
        label={
          required ? (
            <Text style={styles.label}>
              {label}
              <Text style={styles.required}> *</Text>
            </Text>
          ) : (
            label
          )
        }
      />
      <HelperText padding="none" type="error" visible={props.error}>
        {props.errorMessage}
      </HelperText>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    label: {backgroundColor: 'white'},
    required: {color: colors.red},
  });

export default withTheme(InputField);
