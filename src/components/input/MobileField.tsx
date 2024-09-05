import React from 'react';
import {HelperText, Text, TextInput} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {useAppTheme} from '../../utils/theme';

/**
 * Component to render generic input field
 * @param inputLabel
 * @returns {JSX.Element}
 * @constructor
 */
const MobileField: React.FC<any> = ({inputLabel, ...props}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View>
      <Text variant={'bodyMedium'} style={styles.inputLabel}>
        {inputLabel}
        {props.required && <Text>*</Text>}
      </Text>
      <View style={styles.affixContainer}>
        <Text style={styles.affix}>+91</Text>
      </View>
      <TextInput
        {...props}
        mode="outlined"
        dense
        style={styles.inputText}
        outlineStyle={styles.outline}
        placeholderTextColor={theme.colors.neutral200}
        outlineColor={theme.colors.neutral200}
        contentStyle={styles.content}
        contextMenuHidden
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
    content: {fontFamily: 'Inter-Regular', fontWeight: '400', paddingLeft: 48},
    affixContainer: {
      position: 'absolute',
      top: 40,
      left: 10,
      zIndex: 1,
    },
    affix: {
      fontFamily: 'Inter-Regular',
      fontWeight: '400',
      fontSize: 16,
    },
  });

export default MobileField;
