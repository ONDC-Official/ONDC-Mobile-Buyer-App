import React, {useState} from 'react';
import {HelperText, Text, TextInput, withTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native';

/**
 * Component to render input in screens
 * @param props
 * placeholder:string that will be rendered before text input has been entered
 * @returns {JSX.Element}
 * @constructor
 */
/**
 * Component is used to render generic password input field
 * @param required: boolean whether field is required
 * @param label: label of input field
 * @param theme: theme object
 * @param props: other props
 * @returns {JSX.Element}
 * @constructor
 */
const PasswordField: React.FC<any> = ({
                                        required = false,
                                        label,
                                        theme,
                                        ...props
                                      }) => {
  const [hide, setHide] = useState(true);
  const styles = makeStyles(theme.colors);

  return (
    <>
      <TextInput
        mode="outlined"
        {...props}
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
        placeholder={props.placeholder}
        secureTextEntry={hide}
        autoCapitalize={'none'}
        right={
          <TextInput.Icon
            icon={hide ? 'eye-off' : 'eye'}
            onPress={() => setHide(!hide)}
          />
        }
        dense
      />
      <HelperText padding="none" type="error" visible={props.errorMessage}>
        {props.errorMessage}
      </HelperText>
    </>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    label: {backgroundColor: 'white'},
    required: {color: colors.red},
  });

export default withTheme(PasswordField);
