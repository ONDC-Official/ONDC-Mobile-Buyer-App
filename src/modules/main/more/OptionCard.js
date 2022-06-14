import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Icon, Text, withTheme} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {Context as AuthContext} from '../../../context/Auth';
import {clearAllData} from '../../../redux/actions';
import {alertWithTwoButtons} from '../../../utils/alerts';
import {OPTIONS} from '../../../utils/Constants';

/**
 * Component to render single option card in more screen
 * @param navigation :application navigation object
 * @param item : single object from  list
 * @constructor
 * @returns {JSX.Element}
 */
const OptionCard = ({theme, navigation, item}) => {
  const {colors} = theme;

  const {logoutUser} = useContext(AuthContext);

  const dispatch = useDispatch();

  const {t} = useTranslation();

  /**
   * Function handles click event of card and depending on option it navigates to respective screen
   */
  const onPressHandler = option => {
    if (option === OPTIONS.LOG_OUT) {
      alertWithTwoButtons(
        null,
        t('main.more.log_out_message'),
        t('main.product.ok_label'),
        () => {
          logoutUser();
          dispatch(clearAllData());
          navigation.reset({
            index: 0,
            routes: [{name: 'Landing'}],
          });
        },
        t('main.product.cancel_label'),
        () => {},
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
