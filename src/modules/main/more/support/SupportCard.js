import React from 'react';
import {Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text, withTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {appStyles} from '../../../../styles/styles';

const SupportCard = ({theme, url, icon, title, onPress, message, source}) => {
  const {colors} = theme;
  const onPressHandler = async () => {
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
    <Card>
      <View style={styles.container}>
        <View style={[styles.icon]}>
          {icon ? (
            <Icon name={icon} color={colors.accentColor} size={40} />
          ) : (
            <Image source={source} style={styles.image} />
          )}
        </View>
        <View style={[appStyles.container, styles.textContainer]}>
          <Text style={[styles.text, {color: colors.accentColor}]}>
            {title}
          </Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            onPressHandler()
              .then(() => {})
              .catch(() => {});
          }}>
          <Icon name="chevron-right" color={colors.accentColor} size={24} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

export default withTheme(SupportCard);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  image: {height: 30, width: 100},
  icon: {alignItems: 'center', width: 90},
  text: {fontSize: 20, flexShrink: 1},
  textContainer: {flexShrink: 1, marginHorizontal: 8},
});
