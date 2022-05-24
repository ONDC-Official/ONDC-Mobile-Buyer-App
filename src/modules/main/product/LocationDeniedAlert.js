import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Dialog, Divider, Icon, withTheme} from 'react-native-elements';
import {strings} from '../../../locales/i18n';

const locationDeniedMessage = strings('main.product.location_denied_message');
const enterLocationMessage = strings('main.product.enter_location_message');

/**
 * Component to show dialog to select location
 * @param openSheet:function which open the rb sheet
 * @param setIsVisible:function to set vivibility of dialog
 * @param isVisible:indicates vivibility of dialog
 * @constructor
 * @returns {JSX.Element}
 */
const LocationDeniedAlert = ({theme, isVisible, setIsVisible, openSheet}) => {
  const {colors} = theme;

  return (
    <Dialog isVisible={isVisible} overlayStyle={styles.overlayStyle}>
      <View
        style={[
          styles.iconContainer,
          {backgroundColor: colors.statusBackground},
        ]}>
        <Icon
          name="location-off"
          type="material"
          size={34}
          color={colors.accentColor}
        />
      </View>
      <Dialog.Title
        title={locationDeniedMessage}
        titleStyle={styles.titleStyle}
      />
      <Divider/>
      <Dialog.Button
        icon={{
          name: 'search',
          type: 'font-awesome',
          size: 14,
          color: colors.accentColor,
        }}
        title={enterLocationMessage}
        onPress={() => {
          setIsVisible(!isVisible);
          openSheet();
        }}
      />
      <Divider/>
    </Dialog>
  );
};

export default withTheme(LocationDeniedAlert);

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
  titleStyle: {fontSize: 16, alignSelf: 'center'},
  overlayStyle: {borderRadius: 10},
});
