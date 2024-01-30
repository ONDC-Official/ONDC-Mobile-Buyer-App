import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import {useTheme} from 'react-native-paper';

const ViewTypeSelection = ({
  isGridView,
  setIsGridView,
}: {
  isGridView: boolean;
  setIsGridView: (value: boolean) => void;
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.reorderContainer}>
      <TouchableOpacity
        onPress={() => setIsGridView(true)}
        style={[
          styles.reorderButton,
          isGridView ? styles.activeReorderButton : styles.defaultReorderButton,
        ]}>
        <Icon
          name={'reorder-vertical'}
          size={20}
          color={isGridView ? '#fff' : '#333'}
        />
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity
        onPress={() => setIsGridView(false)}
        style={[
          styles.reorderButton,
          isGridView ? styles.defaultReorderButton : styles.activeReorderButton,
        ]}>
        <Icon
          name={'reorder-horizontal'}
          size={20}
          color={isGridView ? '#333' : '#fff'}
        />
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    reorderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
    },
    separator: {
      width: 9,
    },
    reorderButton: {
      padding: 6,
      borderRadius: 8,
      borderWidth: 1,
    },
    activeReorderButton: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    defaultReorderButton: {
      borderColor: '#E8E8E8',
      paddingTop: 12,
    },
  });

export default ViewTypeSelection;
