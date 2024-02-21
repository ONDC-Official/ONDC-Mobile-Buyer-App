import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

const OrContainer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text variant={'labelMedium'} style={styles.label}>
        Or
      </Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#B5B5B5',
  },
  label: {
    color: '#686868',
    paddingHorizontal: 12,
  },
});

export default OrContainer;
