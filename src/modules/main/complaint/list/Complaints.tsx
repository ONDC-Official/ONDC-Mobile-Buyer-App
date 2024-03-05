import React, {memo, useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import {appStyles} from '../../../../styles/styles';
import {keyExtractor, skeletonList} from '../../../../utils/utils';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import {API_BASE_URL, GET_ISSUES} from '../../../../utils/apiActions';
import ComplaintSkeleton from '../components/ComplaintSkeleton';
import ListFooter from '../../order/components/ListFooter';
import Complaint from '../components/Complaint';
import {useAppTheme} from '../../../../utils/theme';

const CancelToken = axios.CancelToken;

/**
 * Component to render complaints screen
 * @constructor
 * @returns {JSX.Element}
 */
const Complaints: React.FC<any> = () => {
  const theme = useAppTheme();
  const styles = makeStyles(theme.colors);
  const isFocused = useIsFocused();
  const source = useRef<any>(null);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const totalComplaints = useRef<number>(0);
  const pageNumber = useRef<number>(1);

  const [complaints, setComplaints] = useState<any>([]);
  const [moreListRequested, setMoreListRequested] = useState<boolean>(false);
  const [refreshInProgress, setRefreshInProgress] = useState<boolean>(false);
  const [apiInProgress, setApiInProgress] = useState<boolean>(false);

  /**
   * function used to request list of complaints
   * @param currentPage: It specifies the number of page
   * @returns {Promise<void>}
   */
  const getComplaints = async (currentPage: number) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${GET_ISSUES}?pageNumber=${currentPage}&limit=10`,
        source.current.token,
      );

      totalComplaints.current = data.totalCount;
      setComplaints(
        currentPage === 1 ? data.issues : [...complaints, ...data.issues],
      );
      pageNumber.current = pageNumber.current + 1;
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404 && complaints.length === 0) {
          setComplaints([]);
        } else {
          handleApiError(error);
        }
      } else {
        handleApiError(error);
      }
    }
  };

  /**
   * Function is called when to get next list of elements on infinite scroll
   */
  const loadMoreList = () => {
    if (totalComplaints.current > complaints?.length && !moreListRequested) {
      setMoreListRequested(true);
      getComplaints(pageNumber.current)
        .then(() => {
          setMoreListRequested(false);
        })
        .catch(() => {
          setMoreListRequested(false);
        });
    }
  };

  useEffect(() => {
    if (isFocused) {
      setApiInProgress(true);
      pageNumber.current = 1;
      getComplaints(pageNumber.current)
        .then(() => {
          setApiInProgress(false);
        })
        .catch(() => {
          setApiInProgress(false);
        });
    }
  }, [isFocused]);

  const onRefreshHandler = () => {
    pageNumber.current = 1;
    setRefreshInProgress(true);
    getComplaints(1)
      .then(() => {
        setRefreshInProgress(false);
      })
      .catch(() => {
        setRefreshInProgress(false);
      });
  };

  /**
   * Component to render single card
   * @param item: single order object
   * @constructor
   * @returns {JSX.Element}
   */
  const renderItem = ({item}: {item: any}) => <Complaint complaint={item} />;

  if (apiInProgress) {
    return (
      <View style={styles.pageContainer}>
        <FlatList
          data={skeletonList}
          renderItem={() => <ComplaintSkeleton />}
          keyExtractor={(item: any) => item.id}
        />
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <FlatList
        data={complaints}
        renderItem={renderItem}
        ListEmptyComponent={() => <Text>No data found</Text>}
        refreshing={refreshInProgress}
        keyExtractor={keyExtractor}
        onRefresh={onRefreshHandler}
        onEndReached={loadMoreList}
        contentContainerStyle={
          complaints.length > 0
            ? {}
            : [appStyles.container, styles.emptyContainer]
        }
        ListFooterComponent={props => (
          <ListFooter moreRequested={moreListRequested} {...props} />
        )}
      />
    </View>
  );
};

const makeStyles = (colors: any) =>
  StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: colors.neutral50,
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    emptyContainer: {justifyContent: 'center', alignItems: 'center'},
  });

export default memo(Complaints);
