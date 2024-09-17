import React, {ReactNode, useCallback, useMemo, useRef, useState} from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAppTheme} from '../../utils/theme';

const AnimationPage = ({
  children,
  list,
}: {
  children: ReactNode;
  list: ReactNode;
}) => {
  const theme = useAppTheme();
  const widthAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState<boolean>(true);

  const styles = useMemo(() => makeStyles(theme.colors), [theme.colors]);

  const toggleWidth = useCallback(() => {
    Animated.timing(widthAnim, {
      toValue: expanded ? -80 : 0,
      duration: 100,
      useNativeDriver: false, // Cannot use native driver for width animation
    }).start();
    setExpanded(prev => !prev);
  }, [expanded, widthAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.listContainer, {marginLeft: widthAnim}]}>
        {list}
      </Animated.View>
      <View style={styles.contentContainer}>
        {children}
        <TouchableOpacity
          style={styles.collapsibleButton}
          onPress={toggleWidth}>
          <Icon
            name={'keyboard-arrow-left'}
            size={20}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    listContainer: {
      borderRightWidth: 1,
      borderRightColor: colors.neutral100,
      width: 80,
    },
    collapsibleButton: {
      position: 'absolute',
      height: 32,
      width: 24,
      backgroundColor: colors.neutral400,
      bottom: 50,
      borderTopRightRadius: 27,
      borderBottomRightRadius: 27,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default AnimationPage;
