import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {SliderBox} from 'react-native-image-slider-box';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {appStyles} from '../../../../styles/styles';
import Details from './Details';

const image = require('../../../../assets/ondc.png');

const ProductDetails = ({theme, navigation, route: {params}}) => {
  const {colors} = theme;
  const {item} = params;

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.white}]}>
      <View style={[appStyles.container, {backgroundColor: colors.white}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIcon}>
          <Icon name="arrow-left" size={16} color={colors.accentColor} />
        </TouchableOpacity>

        <SliderBox
          ImageComponent={FastImage}
          images={
            item.descriptor.images
              ? [...item.descriptor.images, image]
              : [image]
          }
          sliderBoxHeight={250}
          onCurrentImagePressed={index => {}}
          resizeMode="contain"
          dotColor={colors.accentColor}
          inactiveDotColor={colors.greyOutline}
          resizeMethod={'resize'}
          ImageComponentStyle={[
            styles.imageComponentStyle,
            {backgroundColor: colors.white},
          ]}
          dotStyle={styles.dotStyle}
          paginationBoxStyle={[
            styles.paginationBoxStyle,
            {backgroundColor: colors.white},
          ]}
        />
        <ScrollView>
          <View style={styles.imageContainer}>
            <Text style={styles.discriptorName}>{item.descriptor.name}</Text>
            <Text style={[styles.provider, {color: colors.gray}]}>
              Ordering from{' '}
              <Text
                style={[
                  styles.provider,
                  styles.priceContainer,
                  {color: colors.gray},
                ]}>
                {item.provider_details.descriptor.name}
              </Text>
            </Text>
            {item.descriptor.short_desc && (
              <Text style={[styles.provider, {color: colors.gray}]}>
                {item.descriptor.short_desc}
              </Text>
            )}

            <Text style={styles.discriptorName}>
              ₹{item.price.value ? item.price.value : item.price.maximum_value}
            </Text>
          </View>
          <Divider width={1} style={styles.divider} />
          <Details style={styles.divider} item={item} />
          <Divider />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default withTheme(ProductDetails);

const styles = StyleSheet.create({
  discriptorName: {fontSize: 18, fontWeight: '700'},
  provider: {fontSize: 14, marginBottom: 4},
  imageContainer: {padding: 10},
  priceContainer: {fontWeight: '700'},
  imageComponentStyle: {
    width: '100%',
    marginBottom: 30,
  },
  dotStyle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  paginationBoxStyle: {width: '100%'},
  divider: {marginVertical: 8},
  backIcon: {paddingTop: 10, paddingHorizontal: 10, paddingBottom: 5},
});
