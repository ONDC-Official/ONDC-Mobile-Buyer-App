import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text, withTheme} from 'react-native-elements';
import StepIndicator from 'react-native-step-indicator';
import Icon from 'react-native-vector-icons/FontAwesome';

const labels = ['Ordered', 'Shipped', 'Delivered'];
const customStyles = {
  stepIndicatorSize: 40,
  currentStepIndicatorSize: 60,
  separatorStrokeWidth: 5,
  currentStepStrokeWidth: 7,
  stepStrokeCurrentColor: '#ffff',
  stepStrokeWidth: 0,
  stepStrokeFinishedColor: '#ffff',
  stepStrokeUnFinishedColor: '#ffff',
  separatorFinishedColor: '#30B086',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#ffff',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 0,
  currentStepIndicatorLabelFontSize: 0,
  stepIndicatorLabelCurrentColor: '#30B086',
  stepIndicatorLabelFinishedColor: '#30B086',
  stepIndicatorLabelUnFinishedColor: '#30B086',
  labelColor: '#999999',
  labelSize: 16,
  currentStepLabelColor: '#30B086',
};

const OrderCard = ({item, theme}) => {
  const {colors} = theme;
  const separator = ',';
  const [currentPosition, setCurrentPosition] = useState(0);

  const setPosition = () => {
    if (item.state === 'PENDING-CONFIRMATION') {
      setCurrentPosition(0);
    } else if (item.state === 'shipped') {
      setCurrentPosition(1);
    } else {
      setCurrentPosition(2);
    }
  };

  const setColor = position =>
    position <= currentPosition ? '#30B086' : '#aaaaaa';

  useEffect(() => {
    setPosition();
  }, []);

  return item.quote ? (
    <Card containerStyle={styles.card}>
      <Text numberOfLines={1} style={styles.itemName}>
        {item.quote.breakup[0].title}
      </Text>
      <Text style={{color: colors.grey}}>
        Ordered on {moment(item.updated_at).format('LL')}
      </Text>
      <Text style={[styles.price, {color: colors.grey}]}>
        ₹ {item.quote.price.value}
      </Text>
      <View style={styles.addressContainer}>
        <Text style={{color: colors.grey}}>Delivery to:</Text>
        <Text>
          {item.billing.address.building ? item.billing.address.building : null}
          {item.billing.address.building ? separator : null}{' '}
          {item.billing.address.street}, {item.billing.address.city}{' '}
          {item.billing.address.state}
        </Text>
        <Text style={{color: colors.grey}}>
          {item.billing.address.area_code}
        </Text>
      </View>
      <View>
        <Text style={{color: colors.grey}}>Status:</Text>
        <StepIndicator
          currentPosition={currentPosition}
          stepCount={labels.length}
          customStyles={customStyles}
          renderStepIndicator={({position}) => {
            return (
              <View
                style={[
                  styles.stepIndicator,
                  {backgroundColor: setColor(position)},
                ]}
              />
            );
          }}
          labels={labels}
          renderLabel={({position, label}) => {
            return <Text style={{color: setColor(position)}}>{label}</Text>;
          }}
        />
      </View>
      <View>
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.clearCartButton, {borderColor: colors.grey}]}>
            <Text style={[styles.text, {color: colors.grey}]}>Return</Text>
          </TouchableOpacity>
          <View style={styles.space} />
          <TouchableOpacity
            style={[styles.clearCartButton, {borderColor: colors.primary}]}>
            <Text style={[styles.text, {color: colors.primary}]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  ) : null;
};

export default withTheme(OrderCard);

const styles = StyleSheet.create({
  card: {borderRadius: 15, elevation: 4},
  itemName: {textTransform: 'uppercase', fontSize: 16, fontWeight: 'bold'},
  price: {fontSize: 16},
  addressContainer: {marginVertical: 20},
  text: {fontSize: 16},
  container: {
    marginTop: 20,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  clearCartButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
  },
  space: {margin: 10},
  stepIndicator: {width: 20, height: 20, borderRadius: 50},
});
