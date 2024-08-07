import getDistance from 'geolib/es/getDistance';

export default () => {
  const calculateTimeToShip = (
    list: any,
    location: {latitude: number; longitude: number},
  ) => {
    return list.map((item: any) => {
      // const latLong = item.gps.split(/\s*,\s*/);
      // const distance =
      //   getDistance(location, {
      //     latitude: latLong[0],
      //     longitude: latLong[1],
      //   }) / 1000;
      return {
        ...item,
        ...{
          timeToShip: item?.minDaysWithTTS ? item?.minDaysWithTTS / 60 : 0,
          distance: 0,
        },
      };
    });
  };

  return {calculateTimeToShip};
};
