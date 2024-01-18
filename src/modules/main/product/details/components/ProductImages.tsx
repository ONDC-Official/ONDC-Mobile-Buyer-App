import PagerView from 'react-native-pager-view';
import FastImage from 'react-native-fast-image';
import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from 'react-native-paper';

interface ProductImages {
  images: any[];
  roundedCorner?: boolean;
}

const ProductImages: React.FC<ProductImages> = ({
  images,
  roundedCorner = false,
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme.colors);

  const [selectedMediaPosition, setSelectedMediaPosition] = useState(0);

  return (
    <View style={styles.pagerContainer}>
      <PagerView
        onPageSelected={({nativeEvent: {position}}) =>
          setSelectedMediaPosition(position)
        }
        style={[styles.pager]}
        initialPage={0}>
        {images?.map((uri, index) => (
          <FastImage
            key={`${index}image`}
            source={{uri}}
            style={[styles.image, roundedCorner ? styles.roundedCorner : {}]}
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
      height: 220,
      width: '100%',
      objectFit: 'contain',
      alignSelf: 'center',
    },
    pagerContainer: {backgroundColor: 'white', paddingBottom: 8},
    pager: {
      zIndex: 999,
      height: 220,
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
    roundedCorner: {
      borderRadius: 8,
    },
  });

export default ProductImages;
