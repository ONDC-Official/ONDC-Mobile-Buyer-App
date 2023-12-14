import {Text, useTheme} from 'react-native-paper';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import useLogoutUser from '../../../../../hooks/useLogoutUser';
import {alertWithTwoButtons} from '../../../../../utils/alerts';

const Profile = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  const {clearDataAndLogout} = useLogoutUser();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const confirmLogout = () => {
    alertWithTwoButtons(
      'Logout',
      'Are you sure you want to logout?',
      'Cancel',
      () => {},
      'Logout',
      () => clearDataAndLogout(),
    );
  };

  const navigateToOrders = () => navigation.navigate('Orders');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant={'titleSmall'}>Profile</Text>
      </View>
      <TouchableOpacity style={styles.menuOption}>
        <Text variant={'bodyLarge'}>My Profile</Text>
        <Icon name={'chevron-right'} size={24} light />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuOption} onPress={navigateToOrders}>
        <Text variant={'bodyLarge'}>Order History</Text>
        <Icon name={'chevron-right'} size={24} light />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuOption}>
        <Text variant={'bodyLarge'}>Support</Text>
        <Icon name={'chevron-right'} size={24} light />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuOption} onPress={confirmLogout}>
        <Text variant={'bodyLarge'}>Logout</Text>
        <Icon name={'chevron-right'} size={24} light />
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    menuOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 16,
    },
  });

export default Profile;
