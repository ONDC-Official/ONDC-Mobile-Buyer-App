import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, withTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = ({theme, openSheet, location}) => {
  const {colors} = theme;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.subContainer} onPress={openSheet}>
        <Icon name="map-marker" size={20} color={colors.primary} />
        <View style={styles.textContainer}>
          <Text style={{color: colors.primary}}>
            {location} <Icon name="angle-down" size={14} />
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default withTheme(Header);

const styles = StyleSheet.create({
  container: {paddingVertical: 5, marginBottom: 10},
  subContainer: {flexDirection: 'row', alignItems: 'center'},
  textContainer: {marginLeft: 8, flexShrink: 1},
});
