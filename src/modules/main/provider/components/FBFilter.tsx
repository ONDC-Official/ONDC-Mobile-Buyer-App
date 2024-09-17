import React from 'react';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useAppTheme} from '../../../../utils/theme';

const FBFilter = ({
  selectedFilter,
  label,
  value,
  setSelectedFilter,
  imageSource,
}: {
  selectedFilter: string;
  label: string;
  value: string;
  setSelectedFilter: (value: string) => void;
  imageSource: any;
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <TouchableOpacity
      style={[
        styles.filter,
        selectedFilter === value ? styles.selectedFilter : {},
      ]}
      onPress={() =>
        selectedFilter === value
          ? setSelectedFilter('')
          : setSelectedFilter(value)
      }>
      <FastImage source={imageSource} style={styles.filterIcon} />
      <Text variant={'labelLarge'} style={styles.filterLabel}>
        {label}
      </Text>
      {selectedFilter === value ? (
        <Icon
          name={'clear'}
          size={20}
          color={theme.colors.primary}
          style={styles.icon}
        />
      ) : (
        <View style={styles.emptyIcon} />
      )}
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    filter: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.neutral100,
      paddingVertical: 6,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    selectedFilter: {
      backgroundColor: colors.primary50,
      borderColor: colors.primary,
    },
    filterIcon: {
      width: 20,
      height: 20,
    },
    filterLabel: {
      color: colors.neutral400,
      marginLeft: 4,
    },
    icon: {
      marginLeft: 12,
    },
    emptyIcon: {
      height: 20,
    },
  });

export default FBFilter;
