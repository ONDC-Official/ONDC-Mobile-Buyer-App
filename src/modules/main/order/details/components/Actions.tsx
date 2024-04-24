import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import GetStatusButton from './GetStatusButton';
import TrackOrderButton from './TrackOrderButton';
import {useAppTheme} from '../../../../../utils/theme';

interface Actions {
  onUpdateOrder: (value: any, selfUpdate: boolean) => void;
}

const Actions: React.FC<Actions> = ({onUpdateOrder}) => {
  const {colors} = useAppTheme();
  const styles = makeStyles(colors);
  const {orderDetails} = useSelector(({orderReducer}) => orderReducer);

  if (orderDetails?.state !== 'Completed') {
    return (
      <View style={styles.buttonContainer}>
        <GetStatusButton onUpdateOrder={onUpdateOrder} />
        <TrackOrderButton />
      </View>
    );
  }
  return <></>;
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.primary50,
      gap: 15,
    },
  });

export default Actions;
