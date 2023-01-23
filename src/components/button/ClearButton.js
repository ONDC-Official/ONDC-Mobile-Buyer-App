import React from 'react';
import {Text, withTheme} from 'react-native-paper';
import {ActivityIndicator, TouchableOpacity, StyleSheet} from 'react-native';

/**
 * Component to render clear button in the screens
 * @param props
 * textColor:color of title
 * onPress:function which handles click event
 * @returns {JSX.Element}
 * @constructor
 */
const ClearButton = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.loading}
      style={styles.container}>
      {props.loading && (
        <ActivityIndicator color={props.theme.colors.primary} />
      )}
      <Text style={{color: props.theme.colors.primary}}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
export default withTheme(ClearButton);
