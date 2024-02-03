import {ActivityIndicator, Text, useTheme} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView} from 'react-native-webview';
import Polyline from 'mappls-polyline';
import {lineString as makeLineString} from '@turf/helpers';
import deliveryPartner from '../../../../../assets/delivery_partner.png';

import MapplsDirectionWidget, {
  DirectionsCriteria,
} from 'mappls-direction-widget-react-native';
import MapplsGL from 'mappls-map-react-native';

// @ts-ignore
import RNEventSource from 'react-native-event-source';

import useNetworkHandling from '../../../../../hooks/useNetworkHandling';
import {SSE_TIMEOUT} from '../../../../../utils/constants';
import {makeButtonStyles} from './buttonStyles';
import {updateRequestingTracker} from '../../../../../redux/order/actions';
import {
  API_BASE_URL,
  MAP_ACCESS_TOKEN,
  TRACK_ORDER,
} from '../../../../../utils/apiActions';
import {showToastWithGravity} from '../../../../../utils/utils';
import Config from '../../../../../../config';
import { point } from "@turf/helpers";

interface TrackOrderButton {}

const CancelToken = axios.CancelToken;
const screenHeight: number = Dimensions.get('screen').height;

const layerStyles: any = {
  origin: {
    circleRadius: 10,
    circleColor: 'white',
  },
  destination: {
    circleRadius: 10,
    circleColor: 'green',
  },
  route: {
    lineColor: 'red',
    lineCap: 'round',
    lineWidth: 5,
    lineOpacity: 0.84,
  },
  progress: {
    lineColor: '#314ccd',
    lineWidth: 5,
  },
};

const TrackOrderButton: React.FC<TrackOrderButton> = ({}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = makeButtonStyles(theme.colors);
  const trackingSheet = useRef<any>(null);
  const {orderDetails, requestingStatus, requestingTracker} = useSelector(
    ({orderReducer}) => orderReducer,
  );
  const trackEventSourceResponseRef = useRef<any>(null);
  const {token} = useSelector(({authReducer}) => authReducer);
  const source = useRef<any>(null);
  const eventTimeOutRef = useRef<any>(null);
  const [trackingUrl, setTrackingUrl] = useState<string>('');
  const [currentPoint, setCurrentPoint] = useState<any>(null);
  const [route, setRoute] = useState<any>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any>(null);
  const {getDataWithAuth, postDataWithAuth} = useNetworkHandling();

  // TRACK APIS
  // use this api to track and order
  const handleFetchTrackOrderDetails = async () => {
    trackEventSourceResponseRef.current = [];
    dispatch(updateRequestingTracker(true));
    const transaction_id = orderDetails?.transactionId;
    const bpp_id = orderDetails?.bppId;
    const order_id = orderDetails?.id;
    try {
      source.current = CancelToken.source();
      const {data} = await postDataWithAuth(
        `${API_BASE_URL}${TRACK_ORDER}`,
        [
          {
            context: {
              transaction_id,
              bpp_id,
            },
            message: {
              order_id,
            },
          },
        ],
        source.current.token,
      );
      fetchTrackingDataThroughEvents(data[0]?.context?.message_id);
    } catch (err: any) {
      dispatch(updateRequestingTracker(false));
      showToastWithGravity(err?.message);
    }
  };

  // use this function to fetch tracking info through events
  const fetchTrackingDataThroughEvents = (messageId: any) => {
    const eventSource = new RNEventSource(
      `${API_BASE_URL}/clientApis/events?messageId=${messageId}`,
      {
        headers: {Authorization: `Bearer ${token}`},
      },
    );
    eventSource.addEventListener('on_track', (event: any) => {
      const data = JSON.parse(event?.data);
      getTrackOrderDetails(data.messageId).then(() => {});
    });

    const timer = setTimeout(() => {
      eventSource.close();
      clearTimeout(timer);

      if (trackEventSourceResponseRef.current.length <= 0) {
        showToastWithGravity(
          'Cannot proceed with you request now! Please try again',
        );
        dispatch(updateRequestingTracker(false));
      }
    }, SSE_TIMEOUT);

    eventTimeOutRef.current = {
      eventSource,
      timer,
    };
  };

  // on track order
  const getTrackOrderDetails = async (messageId: any) => {
    try {
      source.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}/clientApis/v2/on_track?messageIds=${messageId}`,
        source.current.token,
      );
      dispatch(updateRequestingTracker(false));
      trackEventSourceResponseRef.current = [
        ...trackEventSourceResponseRef.current,
        data[0],
      ];
      const {message} = data[0];
      if (message.tracking.status === 'active' && message.tracking.url === '') {
        dispatch(updateRequestingTracker(false));
        showToastWithGravity(
          'Tracking information is not provided by the provider.',
        );
        return;
      } else if (message?.tracking?.url === '') {
        dispatch(updateRequestingTracker(false));
        showToastWithGravity(
          'Tracking information not available for this product',
        );
        return;
      } else if (
        message.tracking.status === 'active' &&
        (message?.tracking?.url !== '' || message?.tracking?.url !== undefined)
      ) {
        dispatch(updateRequestingTracker(false));
        setTrackingUrl(message?.tracking?.url);
        trackingSheet.current.open();
      } else if (
        message.tracking.status === 'active' &&
        message?.tracking?.location?.gps
      ) {
        const mapResponse = await getDataWithAuth(
          `${API_BASE_URL}${MAP_ACCESS_TOKEN}`,
          source.current.token,
        );
        MapplsGL.setMapSDKKey(mapResponse.data.access_token);
        MapplsGL.setRestAPIKey(mapResponse.data.access_token);
        MapplsGL.setAtlasClientId(mapResponse.data.client_id);
        MapplsGL.setAtlasClientSecret(Config.MMMI_CLIENT_SECRET);
        let locationString = message?.tracking?.location?.gps.replaceAll(
          ' ',
          '',
        );
        let locations = locationString.split(',');
        const endLocation =
          orderDetails?.fulfillments[0]?.end?.location?.gps.split(',');
        const startLocation =
          orderDetails?.fulfillments[0]?.start?.location?.gps.split(',');

        const directionResponse = await MapplsGL.RestApi.direction({
          origin: `${startLocation[1]},${startLocation[0]}`,
          destination: `${endLocation[1]},${endLocation[0]}`,
          resource: 'route_eta',
          profile: 'driving',
          overview: 'simplified',
        });
        setCurrentPoint(`${locations[1]},${locations[0]}`);
        setRoute(Polyline.toGeoJSON(directionResponse.routes[0].geometry, 6));
        setRouteCoordinates(
          Polyline.toGeoJSON(directionResponse.routes[0].geometry, 6).coordinates,
        );
        trackingSheet.current.open();
      } else {
        dispatch(updateRequestingTracker(false));
        showToastWithGravity(
          'Tracking information is not provided by the provider.',
        );
        return;
      }
    } catch (err: any) {
      dispatch(updateRequestingTracker(false));
      showToastWithGravity(err?.message);
      eventTimeOutRef.current.forEach((timeout: any) => {
        timeout.eventSource.close();
        clearTimeout(timeout.timer);
      });
    }
  };

  const hideTrackingSheet = () => trackingSheet?.current?.close();

  const renderOrigin = () => {
    if (!route) {
      return null;
    }

    let backgroundColor = 'red';

    if (currentPoint) {
      backgroundColor = '#314ccd';
    }

    const style = [layerStyles.origin, {circleColor: backgroundColor}];

    return (
      <MapplsGL.ShapeSource id="origin" shape={point(routeCoordinates[0])}>
        <MapplsGL.Animated.CircleLayer id="originInnerCircle" style={style} />
      </MapplsGL.ShapeSource>
    );
  };

  const renderRoute = () => {
    if (!route) {
      return null;
    }

    return (
      <MapplsGL.ShapeSource id="routeSource" shape={route}>
        <MapplsGL.LineLayer
          id="routeFill"
          style={layerStyles.route}
          belowLayerID="originInnerCircle"
        />
      </MapplsGL.ShapeSource>
    );
  };

  const renderCurrentPoint = () => {
    if (!currentPoint) {
      return;
    }
    return (
      <MapplsGL.ShapeSource id="symbolLocationSource" shape={currentPoint}>
        <MapplsGL.SymbolLayer
          id="symbolLocationSymbols"
          minZoomLevel={1}
          style={{
            iconRotationAlignment: 'map',
            iconImage: deliveryPartner,
            iconIgnorePlacement: true,
            iconAllowOverlap: true,
            iconAnchor: 'center',
            iconRotate: ['get', 'bearing'],
            iconSize: 0.07,
          }}
        />
      </MapplsGL.ShapeSource>
    );
  };

  const renderProgressLine = () => {
    if (!currentPoint) {
      return null;
    }

    const {nearestIndex} = currentPoint.properties;
    const coords = route.coordinates.filter((c, i) => i <= nearestIndex);
    coords.push(currentPoint.geometry.coordinates);

    if (coords.length < 2) {
      return null;
    }

    const lineString = makeLineString(coords);
    return (
      <MapplsGL.Animated.ShapeSource id="progressSource" shape={lineString}>
        <MapplsGL.Animated.LineLayer
          id="progressFill"
          style={layerStyles.progress}
          aboveLayerID="routeFill"
        />
      </MapplsGL.Animated.ShapeSource>
    );
  };

  const renderDestination = () => {
    if (!route) {
      return null;
    }

    return (
      <MapplsGL.ShapeSource
        id="destination"
        shape={point(routeCoordinates[routeCoordinates.length - 1])}>
        <MapplsGL.CircleLayer
          id="destinationInnerCircle"
          style={layerStyles.destination}
        />
      </MapplsGL.ShapeSource>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        disabled={requestingTracker || requestingStatus}
        onPress={handleFetchTrackOrderDetails}>
        {requestingTracker ? (
          <ActivityIndicator size={14} color={theme.colors.primary} />
        ) : (
          <></>
        )}
        <Text variant={'bodyMedium'} style={styles.label}>
          Track
        </Text>
      </TouchableOpacity>
      <RBSheet
        ref={trackingSheet}
        height={screenHeight}
        customStyles={{
          container: styles.rbSheet,
          wrapper: styles.wrapper,
        }}>
        <View style={styles.closeSheet}>
          <TouchableOpacity onPress={hideTrackingSheet}>
            <Icon name={'close-circle'} color={theme.colors.error} size={32} />
          </TouchableOpacity>
        </View>
        <MapplsGL.MapView style={styles.webView}>
          <MapplsGL.Camera
            zoomLevel={16}
            centerCoordinate={[77.202432, 28.594475]}
          />
          {renderOrigin()}
          {renderRoute()}
          {renderCurrentPoint()}
          {renderProgressLine()}
          {renderDestination()}
        </MapplsGL.MapView>
        {/*<WebView style={styles.webView} source={{uri: trackingUrl}} />*/}
      </RBSheet>
    </>
  );
};
export default TrackOrderButton;
