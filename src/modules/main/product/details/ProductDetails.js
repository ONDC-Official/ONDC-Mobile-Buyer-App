import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Divider, Text, withTheme} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {SliderBox} from 'react-native-image-slider-box';
import {appStyles} from '../../../../styles/styles';
import Details from './Details';

const image = require('../../../../assets/ondc.png');

const ProductDetails = ({theme, route: {params}}) => {
  const {colors} = theme;
  const {item} = params;

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.white}]}>
      <View style={[appStyles.container, {backgroundColor: colors.white}]}>
        <View style={styles.imageContainer}>
          <Text style={styles.discriptorName}>{item.descriptor.name}</Text>
          <Text style={styles.provider}>{item.provider}</Text>

          <SliderBox
            ImageComponent={FastImage}
            images={[...item.descriptor.images, image]}
            sliderBoxHeight={300}
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
          <Text style={styles.priceContainer}>
            Deal Price: Rs {item.price.value}/-
          </Text>
        </View>
        <Divider width={4} style={styles.divider} />
        <Details width={2} style={styles.divider} item={item} />
        <Divider />
      </View>
    </SafeAreaView>
  );
};

export default withTheme(ProductDetails);

const styles = StyleSheet.create({
  discriptorName: {fontSize: 18, fontWeight: '700'},
  provider: {fontSize: 16},
  imageContainer: {padding: 10},
  priceContainer: {fontWeight: '700'},
  imageComponentStyle: {width: '100%', marginBottom: 30},
  dotStyle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  paginationBoxStyle: {width: '100%'},
  divider: {marginVertical: 10},
});
