import React, {useState} from 'react';
import {HelperText, Text, TextInput} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {useAppTheme} from '../../utils/theme';

/**
 * Component is used to render generic password input field
 * @param label: label of input field
 * @param props: other props
 * @returns {JSX.Element}
 * @constructor
 */
const PasswordField: React.FC<any> = ({inputLabel, ...props}) => {
  const theme = useAppTheme();
  const [hide, setHide] = useState(true);
  const styles = makeStyles(theme.colors);

  return (
    <>
      <Text variant={'bodyMedium'} style={styles.inputLabel}>
        {inputLabel}
        {props.required && <Text>*</Text>}
      </Text>
      <TextInput
        mode="outlined"
        {...props}
        contextMenuHidden
        selectTextOnFocus={false}
        dense
        style={styles.inputText}
        secureTextEntry={hide}
        autoCapitalize={'none'}
        right={
          <TextInput.Icon
            icon={hide ? 'eye-off' : 'eye'}
            onPress={() => setHide(!hide)}
          />
        }
        outlineStyle={styles.outline}
        placeholderTextColor={theme.colors.neutral200}
        outlineColor={theme.colors.neutral200}
        contentStyle={styles.contant}
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
    inputText: {
      fontWeight: '400',
      backgroundColor: colors.white,
    },
    contant: {fontFamily: 'Inter-Regular', fontWeight: '400'},
  });

export default PasswordField;
