import {Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

const List = () => {
  const styles = makeStyles();
  return (
    <View style={styles.container}>
      <Text>Coming soon</Text>
    </View>
  );
};

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default List;
