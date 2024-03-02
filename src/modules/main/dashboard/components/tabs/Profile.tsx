import {Text} from 'react-native-paper';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import useLogoutUser from '../../../../../hooks/useLogoutUser';
import {alertWithTwoButtons} from '../../../../../utils/alerts';
import {useAppTheme} from '../../../../../utils/theme';

const Profile = () => {
  const theme = useAppTheme();
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

  const navigateToProfile = () => navigation.navigate('MyProfile');

  const navigateToOrders = () => navigation.navigate('Orders');

  const navigateToComplaints = () => navigation.navigate('Complaints');

  const menu = [
    {
      title: 'My Profile',
      action: navigateToProfile,
    },
    {
      title: 'Order History',
      action: navigateToOrders,
    },
    {
      title: 'Complaints',
      action: navigateToComplaints,
    },
    {
      title: 'Logout',
      action: confirmLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant={'titleLarge'} style={styles.pageTitle}>
          Profile
        </Text>
      </View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        keyExtractor={item => item.title}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        data={menu}
        renderItem={({item: {title, action}}) => (
          <TouchableOpacity style={styles.menuOption} onPress={action}>
            <Text variant={'titleMedium'} style={styles.menuName}>
              {title}
            </Text>
            <Icon
              name={'keyboard-arrow-right'}
              size={24}
              color={theme.colors.neutral400}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    header: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    pageTitle: {
      color: colors.neutral400,
    },
    listContainer: {
      paddingHorizontal: 16,
    },
    menuOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 20,
    },
    menuName: {
      color: colors.neutral400,
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: colors.neutral100,
    },
  });

export default Profile;
