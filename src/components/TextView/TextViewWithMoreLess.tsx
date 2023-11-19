import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, withTheme} from 'react-native-paper';

const TextViewWithMoreLess: React.FC<any> = ({textContent, theme, style}) => {
  const styles = makeStyles(theme.colors);
  const [showMoreButton, setShowMoreButton] = useState<boolean>(false);
  const [textShown, setTextShown] = useState<boolean>(false);
  const [numLines, setNumLines] = useState<number | undefined>(undefined);

  const toggleTextShown = () => {
    setTextShown(!textShown);
  };

  useEffect(() => {
    setNumLines(textShown ? undefined : 2);
  }, [textShown]);

  const onTextLayout = useCallback(
    (event: any) => {
      if (event.nativeEvent.lines.length > 2 && !textShown) {
        setShowMoreButton(true);
        setNumLines(2);
      }
    },
    [textShown],
  );

  return (
    <View style={style}>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={numLines}
        style={{lineHeight: 21}}>
        {textContent}
      </Text>

      {showMoreButton ? (
        <Text onPress={toggleTextShown} style={styles.moreLessTextStyle}>
          {textShown ? ' less' : ' more'}
        </Text>
      ) : null}
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    moreLessTextStyle: {
      lineHeight: 18,
      color: colors.primary,
    },
  });

export default withTheme(TextViewWithMoreLess);
