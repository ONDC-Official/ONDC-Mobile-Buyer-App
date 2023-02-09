import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Button, Divider, Menu, withTheme} from 'react-native-paper';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchTypeMenu = ({
  theme,
  searchType,
  onProductSelect,
  onProviderSelect,
}) => {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Menu
      contentStyle={[styles.menu]}
      anchorPosition={'top'}
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <TouchableOpacity
          style={[styles.menu, {backgroundColor: theme.colors.primary}]}
          activeOpacity={0.8}
          onPress={openMenu}>
          <Text style={{color: theme.colors.surface}}>
            {searchType} <Icon name="angle-down" size={14} />
          </Text>
        </TouchableOpacity>
      }>
      <Button
        onPress={() => {
          onProductSelect();
          closeMenu();
        }}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContainer}
        mode="text">
        Product
      </Button>
      <Divider />
      <Button
        onPress={() => {
          onProviderSelect();
          closeMenu();
        }}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContainer}
        mode="text">
        Provider
      </Button>
    </Menu>
  );
};

export default withTheme(SearchTypeMenu);

const styles = StyleSheet.create({
  buttonContainer: {
    height: 60,
    justifyContent: 'flex-start',
  },
  buttonLabel: {
    textAlign: 'left',
    fontSize: 18,
  },
  menu: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  menuOption: {
    padding: 16,
    width: 100,
  },
});
