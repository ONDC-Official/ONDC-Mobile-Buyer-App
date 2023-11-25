import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Text, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';

interface CustomMenuItem {
  item: any;
  selected: boolean;
}

const NoImageAvailable = require('../../../../assets/noImage.png');

const CustomMenuItem: React.FC<CustomMenuItem> = ({item, selected}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <FastImage
        style={[styles.image, selected ? styles.selected : styles.normal]}
        source={
          item?.descriptor?.images
            ? {uri: item?.descriptor?.images[0]}
            : NoImageAvailable
        }
      />
      <Text variant={'labelSmall'} style={styles.title}>
        {item?.descriptor?.name}
      </Text>
    </View>
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
