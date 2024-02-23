import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import {useAppTheme} from '../../../utils/theme';

const FormSwitch = ({
  formType,
  setFormType,
}: {
  formType: string;
  setFormType: (value: string) => void;
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        onPress={() => setFormType('email')}
        style={[
          styles.segmentButton,
          formType === 'email' ? styles.selectedSegment : {},
        ]}>
        <Text
          variant={'bodyMedium'}
          style={[
            styles.segmentLabel,
            formType === 'email' ? styles.selectedSegmentLabel : {},
          ]}>
          Email Address
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setFormType('phone')}
        style={[
          styles.segmentButton,
          formType === 'phone' ? styles.selectedSegment : {},
        ]}>
        <Text
          variant={'bodyMedium'}
          style={[
            styles.segmentLabel,
            formType === 'phone' ? styles.selectedSegmentLabel : {},
          ]}>
          Phone No.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.neutral100,
      borderRadius: 25,
      marginHorizontal: 16,
    },
    segmentButton: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      flex: 1,
      alignItems: 'center',
    },
    segmentLabel: {
      color: colors.neutral300,
    },
    selectedSegmentLabel: {
      color: colors.white,
    },
    selectedSegment: {
      backgroundColor: colors.primary,
      borderRadius: 25,
    },
  });

export default FormSwitch;
