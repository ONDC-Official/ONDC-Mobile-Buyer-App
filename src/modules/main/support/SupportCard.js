import React from 'react';
import {Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IconButton, Text, withTheme} from 'react-native-paper';

import {appStyles} from '../../../styles/styles';

/**
 * Component to render single card on support screen
 * @param theme
 * @param icon:icon to show in card
 * @param url:url
 * @param title:title of card
 * @param message:message to show below the card
 * @param source
 * @constructor
 * @returns {JSX.Element}
 */
const SupportCard = ({theme, url, icon, title, message, source}) => {
  const {colors} = theme;

  /**
   * function handles click event of next arrow and navigates to the given url
   * @returns {Promise<void>}
   */
  const openSupportLink = async () => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={openSupportLink}>
      <View style={styles.icon}>
        {icon ? (
          <Icon name={icon} color={colors.primary} size={40} />
        ) : (
          <Image source={source} style={styles.image} />
        )}
      </View>
      <View style={[appStyles.container, styles.textContainer]}>
        <Text style={[styles.text, {color: colors.primary}]}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <IconButton icon="chevron-right" iconColor={colors.primary} style={24} />
    </TouchableOpacity>
  );
};

export default withTheme(SupportCard);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 10,
    padding: 10,
  },
  image: {height: 30, width: 100},
  icon: {alignItems: 'center', width: 90},
  text: {fontSize: 20, flexShrink: 1},
  textContainer: {flexShrink: 1, marginHorizontal: 8},
});
