import React, {useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, withTheme} from 'react-native-paper';

const TextViewWithMoreLess = ({textContent, theme, style}) => {
  const {colors} = theme;
  const [textShown, setTextShown] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
  console.log('Number of lines', e.nativeEvent.lines.length)
    setLengthMore(e.nativeEvent.lines.length >= 2);
  }, []);

  return (
    <View style={[styles.mainContainer, style]}>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : 2}
        style={{lineHeight: 21}}>
        {textContent}
      </Text>

      {lengthMore ? (
        <Text
          onPress={toggleNumberOfLines}
          style={[{color: colors.primary}, styles.moreLessTextStyle]}>
          {textShown ? 'less' : 'more'}
        </Text>
      ) : null}
    </View>
  );
};

export default withTheme(TextViewWithMoreLess);

const styles = StyleSheet.create({
  mainContainer: {},
  moreLessTextStyle: {
    lineHeight: 18,
  },
});
