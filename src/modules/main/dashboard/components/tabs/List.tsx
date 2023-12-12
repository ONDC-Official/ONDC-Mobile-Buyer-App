import {Text, useTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

const List = () => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);
  return (
    <View style={styles.container}>
      <Text>Coming soon</Text>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default List;
