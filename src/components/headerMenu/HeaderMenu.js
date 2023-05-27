import {StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, Button, Divider, Menu} from 'react-native-paper';
import {getUserInitials} from '../../utils/utils';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {logoutUser} from '../../redux/auth/actions';
import {alertWithTwoButtons} from '../../utils/alerts';

const HeaderMenu = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {name, photoURL} = useSelector(({authReducer}) => authReducer);

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const logout = () => {
    closeMenu();
    logoutUser(dispatch);
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  const onLogoutSelect = () => {
    closeMenu();
    alertWithTwoButtons(
      'Logout',
      'Are you sure want to end the session?',
      'Yes',
      logout,
      'Cancel',
      () => null,
    );
  };

  const navigateToPage = page => {
    closeMenu();
    navigation.navigate(page);
  };

  return (
    <Menu
      contentStyle={styles.menu}
      anchorPosition={'top'}
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity onPress={openMenu}>
          {photoURL ? (
            <Avatar.Image size={32} rounded source={{uri: photoURL}} />
          ) : (
            <Avatar.Text
              size={32}
              rounded
              label={getUserInitials(name ?? '')}
            />
          )}
        </TouchableOpacity>
      }>
      <Button
        onPress={() => navigateToPage('Profile')}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContainer}
        icon="face-man-profile"
        mode="text">
        Profile
      </Button>
      <Divider />
      <Button
        onPress={() => navigateToPage('Orders')}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContainer}
        icon="format-list-text"
        mode="text">
        Orders
      </Button>
      <Divider />
      <Button
        onPress={() => navigateToPage('Support')}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContainer}
        icon="help"
        mode="text">
        Support
      </Button>
      <Divider />
      <Button
        onPress={onLogoutSelect}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContainer}
        icon="logout"
        mode="text">
        Logout
      </Button>
    </Menu>
  );
};

const styles = StyleSheet.create({
  menu: {
    backgroundColor: 'white',
    marginTop: 32,
    width: 200,
    marginEnd: 16,
  },
  buttonContainer: {
    height: 60,
    justifyContent: 'flex-start',
  },
  buttonLabel: {
    textAlign: 'left',
    fontSize: 18,
  },
});

export default HeaderMenu;
