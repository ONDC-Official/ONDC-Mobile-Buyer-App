import PagerView from 'react-native-pager-view';
import FastImage from 'react-native-fast-image';
import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from 'react-native-paper';

interface ProductImages {
  images: any[];
}

const imageSize = Dimensions.get('window').width;

const ProductImages: React.FC<ProductImages> = ({images}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const [selectedMediaPosition, setSelectedMediaPosition] = useState(0);

  return (
    <View style={styles.pagerContainer}>
      <PagerView
        onPageSelected={({nativeEvent: {position}}) =>
          setSelectedMediaPosition(position)
        }
        style={[styles.pager, {height: imageSize}]}
        initialPage={0}>
        {images?.map((uri, index) => (
          <FastImage
            key={`${index}image`}
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
            style={
              index === selectedMediaPosition ? styles.selectedDot : styles.dot
            }
          />
        ))}
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    image: {
      height: imageSize,
      width: imageSize,
      alignSelf: 'center',
    },
    pagerContainer: {backgroundColor: 'white', paddingBottom: 20},
    pager: {
      zIndex: 999,
    },
    pageIndicator: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      bottom: 0,
      marginTop: 16,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
      backgroundColor: '#E8E8E8',
    },
    selectedDot: {
      width: 24,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
      backgroundColor: colors.primary,
    },
  });

export default ProductImages;
