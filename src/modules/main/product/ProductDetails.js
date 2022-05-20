import React from 'react';
import {SafeAreaView, View} from 'react-native';
import {appStyles} from '../../../styles/styles';
import {SliderBox} from 'react-native-image-slider-box';
import FastImage from 'react-native-fast-image';
import {Divider, Text, withTheme} from 'react-native-elements';
import Details from './component/Details';
const image = require('../../../assets/logo.png');

const ProductDetails = ({theme, route: {params}}) => {
  const {colors} = theme;
  const {item} = params;

  return (
    <SafeAreaView
      style={[appStyles.container, {backgroundColor: colors.white}]}>
      <View style={[appStyles.container, {backgroundColor: colors.white}]}>
        <View style={{padding: 10}}>
          <Text style={{fontSize: 18, fontWeight: '700'}}>
            {item.descriptor.name}
          </Text>
          <Text style={{fontSize: 16}}>{item.provider}</Text>

          <SliderBox
            ImageComponent={FastImage}
            images={[...item.descriptor.images, image]}
            sliderBoxHeight={300}
            onCurrentImagePressed={index =>
              console.log(`image ${index} pressed`)
            }
            resizeMode="contain"
            dotColor={colors.accentColor}
            inactiveDotColor={colors.greyOutline}
            resizeMethod={'resize'}
            ImageComponentStyle={{
              width: '100%',
              marginBottom: 30,
              backgroundColor: colors.white,
            }}
            dotStyle={{
              width: 12,
              height: 12,
              borderRadius: 6,
            }}
            paginationBoxStyle={{
              backgroundColor: colors.white,
              width: '100%',
            }}
          />
          <Text style={{fontWeight: '700'}}>
            Deal Price: Rs {item.price.value}/-
          </Text>
        </View>
        <Divider width={4} style={{marginVertical: 10}} />
        <Details width={2} style={{marginVertical: 10}} item={item} />
        <Divider />
      </View>
    </SafeAreaView>
  );
};

export default withTheme(ProductDetails);
