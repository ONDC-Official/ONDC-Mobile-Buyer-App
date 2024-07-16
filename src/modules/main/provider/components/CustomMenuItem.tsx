import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useAppTheme} from '../../../../utils/theme';

interface CustomMenuItem {
  item: any;
  selected: boolean;
  setSelectedMenu: (menu: any) => void;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const CustomMenuItem: React.FC<CustomMenuItem> = ({
  item,
  selected,
  setSelectedMenu,
}) => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setSelectedMenu(item.id)}>
      <FastImage
        style={[styles.image, selected ? styles.selected : styles.normal]}
        source={
          item?.descriptor?.images?.length > 0
            ? {uri: item?.descriptor?.images[0]}
            : NoImageAvailable
        }
      />
      <Text variant={'labelSmall'} style={styles.title}>
        {item?.descriptor?.name}
      </Text>
    </TouchableOpacity>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: 56,
      marginRight: 24,
    },
    image: {
      width: 56,
      height: 56,
      marginBottom: 6,
    },
    title: {
      width: 56,
      fontWeight: '700',
      textAlign: 'center',
    },
    selected: {
      borderRadius: 28,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    normal: {
      borderRadius: 28,
      borderWidth: 1,
      borderColor: '#E7E7E7',
    },
  });

export default CustomMenuItem;
