import React from 'react';
import {StyleSheet, View} from 'react-native';
import {withTheme} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import ContainButton from '../../../../components/button/ContainButton';

const Pagination = ({
  theme,
  pageNumber,
  count,
  appliedFilters,
  moreListRequested,
  setMoreListRequested,
  previousRequested,
  setPreviousRequested,
  flatListRef,
  getProductsList,
}) => {
  const {products} = useSelector(({productReducer}) => productReducer);

  const {messageId, transactionId} = useSelector(
    ({filterReducer}) => filterReducer,
  );

  const {colors} = theme;

  const loadMoreList = (button, setRequest) => {
    if (
      count &&
      count > products.length &&
      !moreListRequested &&
      !previousRequested
    ) {
      pageNumber.current =
        button === 'Next' ? pageNumber.current + 1 : pageNumber.current - 1;
      setRequest(true);
      getProductsList(
        messageId,
        transactionId,
        pageNumber.current,
        appliedFilters,
      )
        .then(() => {
          flatListRef.current.scrollToOffset({animated: false, offset: 0});
          setRequest(false);
        })
        .catch(() => {
          setRequest(false);
        });
    }
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.previousButton}>
        <ContainButton
          title="Previous"
          onPress={() => {
            loadMoreList(null, setPreviousRequested);
          }}
          loading={previousRequested}
          icon={() => (
            <Icon
              name="chevron-left"
              size={20}
              color={
                pageNumber.current === 1 ? colors.greyOutline : colors.white
              }
            />
          )}
          disabled={pageNumber.current === 1}
        />
      </View>

      <View style={styles.nextButton}>
        <ContainButton
          title="Next"
          onPress={() => {
            loadMoreList('Next', setMoreListRequested);
          }}
          loading={moreListRequested}
          disabled={pageNumber.current === Math.ceil(count / 10)}
          icon={() => (
            <Icon
              name="chevron-right"
              size={20}
              color={
                pageNumber.current === Math.ceil(count / 10)
                  ? colors.greyOutline
                  : colors.white
              }
            />
          )}
          iconRight={true}
        />
      </View>
    </View>
  );
};

export default withTheme(Pagination);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
  },
  nextButton: {width: 90},
  previousButton: {width: 110},
});
