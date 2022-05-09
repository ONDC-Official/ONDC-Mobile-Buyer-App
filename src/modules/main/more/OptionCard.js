import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Icon, Text, withTheme} from 'react-native-elements';
import {Context as AuthContext} from '../../../context/Auth';
import {OPTIONS} from '../../../utils/Constants';
import {useDispatch} from 'react-redux';
import {clearAllData} from '../../../redux/actions';
import {alertWithTwoButtons} from '../../../utils/alerts';

const OptionCard = ({theme, navigation, item}) => {
  const {colors} = theme;
  const {logoutUser} = useContext(AuthContext);
  const dispatch = useDispatch();

  const onPressHandler = option => {
    if (option === OPTIONS.LOG_OUT) {
      alertWithTwoButtons(
        null,
        'Are you sure you want to log out?',
        'Ok',
        () => {
          logoutUser();
          dispatch(clearAllData());
          navigation.reset({
            index: 0,
            routes: [{name: 'Landing'}],
          });
        },
        'Cancel',
        () => console.log('cancelled'),
      );
    } else if (option === OPTIONS.PROFILE) {
      navigation.navigate('Profile');
    } else if (option === OPTIONS.SUPPORT) {
      navigation.navigate('Support');
    }
  };
  return (
    <Card containerStyle={styles.card}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          onPressHandler(item.name);
        }}>
        <Icon type="font-awesome" name={item.icon} color={colors.accentColor} />
        <Text style={[styles.text, {color: colors.accentColor}]}>
          {item.string}
        </Text>
      </TouchableOpacity>
    </Card>
  );
};

export default withTheme(OptionCard);

const styles = StyleSheet.create({
  card: {elevation: 5, borderRadius: 50, paddingHorizontal: 30},
  text: {fontSize: 18, marginLeft: 16},
  container: {flexDirection: 'row'},
});
