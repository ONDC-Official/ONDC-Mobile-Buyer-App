import React, {useState} from 'react';
import {HelperText, Text, TextInput, withTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native';

/**
 * Component is used to render generic password input field
 * @param label: label of input field
 * @param theme: theme object
 * @param props: other props
 * @returns {JSX.Element}
 * @constructor
 */
const PasswordField: React.FC<any> = ({inputLabel, theme, ...props}) => {
  const [hide, setHide] = useState(true);
  const styles = makeStyles(theme.colors);

  return (
    <>
      <Text variant={'bodySmall'} style={styles.inputLabel}>
        {inputLabel}
      </Text>
      <TextInput
        mode="outlined"
        {...props}
        dense
        secureTextEntry={hide}
        autoCapitalize={'none'}
        right={
          <TextInput.Icon
            icon={hide ? 'eye-off' : 'eye'}
            onPress={() => setHide(!hide)}
          />
        }
        outlineStyle={styles.outline}
        placeholderTextColor={'#B5B5B5'}
        outlineColor={'#B5B5B5'}
      />
      {props.error && (
        <HelperText padding="none" type="error" visible={props.errorMessage}>
          {props.errorMessage}
        </HelperText>
      )}
    </>
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

export default withTheme(PasswordField);
