import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Dialog, Divider, Icon, withTheme} from 'react-native-elements';

const Alert = ({theme, isVisible, setIsVisible, openSheet}) => {
  const {colors} = theme;

  return (
    <Dialog isVisible={isVisible} overlayStyle={styles.overlayStyle}>
      <View
        style={[styles.iconContainer, {backgroundColor: colors.greyOutline}]}>
        <Icon
          name="location-off"
          type="material"
          size={34}
          color={colors.primary}
        />
      </View>
      <Dialog.Title
        title="Location permission not enabled"
        titleStyle={styles.titleStyle}
      />
      <Divider />
      <Dialog.Button
        icon={{
          name: 'search',
          type: 'font-awesome',
          size: 14,
          color: theme.colors.primary,
        }}
        title="Enter location manually"
        onPress={() => {
          setIsVisible(!isVisible);
          openSheet();
        }}
      />
      <Divider />
    </Dialog>
  );
};

export default withTheme(Alert);

const styles = StyleSheet.create({
  iconContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    alignSelf: 'center',
  },
  titleStyle: {fontSize: 16},
  overlayStyle: {borderRadius: 10},
});
