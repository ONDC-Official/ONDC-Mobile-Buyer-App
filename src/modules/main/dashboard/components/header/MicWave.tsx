import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet} from 'react-native';

const MicWave = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 4,
          duration: 3000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 3000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [scaleValue, opacityValue]);

  return (
    <Animated.View
      style={[
        styles.micWaves,
        {
          transform: [{scale: scaleValue}],
          opacity: opacityValue,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  micWaves: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 142, 204, 0.4)',
    borderRadius: 50,
  },
});

export default MicWave;
