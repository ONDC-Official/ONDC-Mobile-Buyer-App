import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import GetStatusButton from './GetStatusButton';
import TrackOrderButton from './TrackOrderButton';

interface Actions {
  onUpdateOrder: (value: any) => void;
}

const Actions: React.FC<Actions> = ({onUpdateOrder}) => {
  const styles = makeStyles();
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);

  if (orderDetails?.state !== 'Completed') {
    return (
      <View style={styles.buttonContainer}>
        <GetStatusButton onUpdateOrder={onUpdateOrder} />
        <View style={styles.buttonSeparator} />
        <TrackOrderButton />
      </View>
    );
  }
  return <></>;
};

const makeStyles = () =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#ECF3F8',
    },
    buttonSeparator: {
      width: 15,
    },
  });

export default Actions;
