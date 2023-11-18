import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {appStyles} from '../../../styles/styles';
import OutlineButton from '../../../components/button/OutlineButton';

/**
 * Component to render list empty component
 * @constructor
 * @returns {JSX.Element}
 */
const EmptyComponent = ({theme, navigation}) => {
  const {colors} = theme;

  return (
    <View style={[appStyles.container, styles.container]}>
      <Icon name="cart-outline" size={60} color={colors.primary}/>
      <Text style={styles.title}>Your cart is empty</Text>
      <Text style={styles.subTitle}>
        Looks like your shopping cart is empty, you can shop now by clicking
        below button
      </Text>
      <OutlineButton
        onPress={() => navigation.navigate('Dashboard')}
        label={'Shop Now'}
      />
    </View>
  );
};

export default withTheme(EmptyComponent);

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 18, fontWeight: '600', marginVertical: 10},
  subTitle: {textAlign: 'center', lineHeight: 22},
});
