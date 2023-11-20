import {Text, useTheme} from 'react-native-paper';
import {StyleProp, StyleSheet, TextStyle} from 'react-native';
import React from 'react';

interface Caption {
  children: any;
  variant: string | undefined;
  textStyle: StyleProp<TextStyle> | undefined;
}

const Caption: React.FC<Caption> = ({children, variant, textStyle}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  let variantStyle = {};

  if (variant === 'caption1') {
    variantStyle = styles.caption1;
  }

  return <Text style={[textStyle || {}, variantStyle]}>{children}</Text>;
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    caption1: {
      fontSize: 12,
      lineHeight: 16,
    },
  });

export default Caption;
