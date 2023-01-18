import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Dialog, Divider, withTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';

/**
 * Component to show dialog to select location
 * @param theme
 * @param openSheet:function which open the rb sheet
 * @param setIsVisible:function to set visibility of dialog
 * @param isVisible:indicates visibility of dialog
 * @constructor
 * @returns {JSX.Element}
 */
const LocationDeniedAlert = ({theme, isVisible, setIsVisible, openSheet}) => {
  const {colors} = theme;

  const {t} = useTranslation();

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
          color={colors.primary}
        />
      </View>
      <Dialog.Title
        title={'Location permission not enabled'}
        titleStyle={styles.titleStyle}
      />
      <Divider />
      <Dialog.Button
        icon={{
          name: 'search',
          type: 'font-awesome',
          size: 14,
          color: colors.primary,
        }}
        title={'Enter location manually'}
        onPress={() => {
          setIsVisible(!isVisible);
          openSheet();
        }}
      />
      <Divider />
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
