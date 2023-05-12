import React, {useState, useCallback, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, withTheme} from 'react-native-paper';

const TextViewWithMoreLess = ({textContent, theme, style}) => {
  const {colors} = theme;
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [textShown, setTextShown] = useState(false);
  const [numLines, setNumLines] = useState(undefined);

  const toggleTextShown = () => {
    setTextShown(!textShown);
  };

  useEffect(() => {
    setNumLines(textShown ? undefined : 2);
  }, [textShown]);

  const onTextLayout = useCallback(
    event => {
      if (event.nativeEvent.lines.length > 2 && !textShown) {
        setShowMoreButton(true);
        setNumLines(2);
      }
    },
    [textShown],
  );

  return (
    <View style={[styles.mainContainer, style]}>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={numLines}
        style={{lineHeight: 21}}>
        {textContent}
      </Text>

      {showMoreButton ? (
        <Text
          onPress={toggleTextShown}
          style={[{color: colors.primary}, styles.moreLessTextStyle]}>
          {textShown ? ' less' : ' more'}
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
