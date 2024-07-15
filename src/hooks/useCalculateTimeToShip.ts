import getDistance from 'geolib/es/getDistance';

export default () => {
  const calculateTimeToShip = (
    list: any,
    location: {latitude: number; longitude: number},
  ) => {
    const updatedStores = list.map((item: any) => {
      const latLong = item.gps.split(/\s*,\s*/);
      const minTimeToShip = item?.min_time_to_ship ?? 0;
      const maxTimeToShip = item?.max_time_to_ship ?? 0;
      const averageTimeToShip = (minTimeToShip + maxTimeToShip) / 2 / 60;
      const distance =
        getDistance(location, {
          latitude: latLong[0],
          longitude: latLong[1],
        }) / 1000;
      return {
        ...item,
        ...{
          timeToShip: averageTimeToShip + (distance * 60) / 15,
        },
      };
    });

    return updatedStores.sort((a: any, b: any) => a.timeToShip - b.timeToShip);
  };

  return {calculateTimeToShip};
};
