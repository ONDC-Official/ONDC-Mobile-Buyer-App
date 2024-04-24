import DropDown from 'react-native-paper-dropdown';
import {HelperText, Text} from 'react-native-paper';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useAppTheme} from '../../utils/theme';
import { fontConfig } from 'react-native-paper/lib/typescript/styles/fonts';

const DropdownField: React.FC<any> = ({label, inputLabel, ...props}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const [showDropDown, setShowDropDown] = useState(false);

  return (
    <View>
      <Text variant={'bodyMedium'} style={styles.inputLabel}>
        {inputLabel}
        {props.required && <Text>*</Text>}
      </Text>
      <DropDown
        inputProps={{
          dense: true,
          outlineStyle: styles.outline,
          placeholderTextColor: theme.colors.neutral200,
          outlineColor: theme.colors.neutral200,
          style: styles.inputText,
        }}
        {...props}
        label={label}
        mode={'outlined'}
        visible={showDropDown}
        showDropDown={() => setShowDropDown(true)}
        onDismiss={() => setShowDropDown(false)}
        dropDownItemTextStyle={styles.dropdownText}
        dropDownItemSelectedTextStyle={styles.dropdownText}
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
      backgroundColor: colors.white,
    },
    dropdownText: {
      fontFamily: 'Inter-Regular',
      fontWeight: '400',
    },
  });

export default DropdownField;
