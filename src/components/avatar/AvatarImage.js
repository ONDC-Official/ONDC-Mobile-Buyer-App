import FastImage from 'react-native-fast-image';
import React, {memo} from 'react';
import {withTheme} from 'react-native-elements';

/**
 * Component to render image in the avatar
 * @param uri: profile image url or avatar image url
 * @param dimension: avatar size
 * @param backgroundColor: background color of avatar
 * @returns {JSX.Element}
 * @constructor
 */
const AvatarImage = ({uri, dimension, backgroundColor}) => {
  const style = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
    backgroundColor: backgroundColor,
  };

  const image =
    uri === 'Unknown'
      ? require('../../assets/profile.png')
      : {
          uri,
          priority: FastImage.priority.normal,
        };

  return (
    <FastImage
      style={style}
      source={image}
      resizeMode={FastImage.resizeMode.cover}
    />
  );
};

export default withTheme(memo(AvatarImage));
