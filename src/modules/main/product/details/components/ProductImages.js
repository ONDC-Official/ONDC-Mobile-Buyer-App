import PagerView from 'react-native-pager-view';
import FastImage from 'react-native-fast-image';
import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {withTheme} from 'react-native-paper';

const imageSize = Dimensions.get('window').width;

const ProductImages = ({theme, images}) => {
  const [selectedMediaPosition, setSelectedMediaPosition] = useState(0);

  return (
    <View style={styles.pagerContainer}>
      <PagerView
        onPageSelected={({nativeEvent: {position}}) =>
          setSelectedMediaPosition(position)
        }
        style={[styles.pager, {height: imageSize}]}
        initialPage={0}>
        {images?.map(uri => (
          <FastImage
            key={uri}
            source={{uri}}
            style={styles.image}
            resizeMode={'contain'}
          />
        ))}
      </PagerView>
      <View style={styles.pageIndicator}>
        {images.map((item, index) => (
          <View
            key={`${index}dot`}
            backgroundColor={
              index === selectedMediaPosition ? theme.colors.primary : 'black'
            }
            style={styles.dot}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    height: imageSize,
    width: imageSize,
    alignSelf: 'center',
  },
  pagerContainer: {backgroundColor: 'white', paddingBottom: 16},
  pager: {
    zIndex: 999,
  },
  pageIndicator: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 0,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 10,
    marginHorizontal: 7,
  }
});

export default withTheme(ProductImages);
