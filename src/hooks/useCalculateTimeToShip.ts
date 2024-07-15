import getDistance from 'geolib/es/getDistance';

export default () => {
  const calculateTimeToShip = (
    list: any,
    location: {latitude: number; longitude: number},
  ) => {
    const updatedStores = list.map((item: any) => {
      const latLong = item.gps.split(/\s*,\s*/);
      const medianTimeToShip = item?.median_time_to_ship ?? 0;
      const medianTimeToShipInMinutes = medianTimeToShip / 60;
      const distance =
        getDistance(location, {
          latitude: latLong[0],
          longitude: latLong[1],
        }) / 1000;
      const distanceString = Number.isInteger(distance)
        ? String(distance)
        : distance.toFixed(1);
      return {
        ...item,
        ...{
          timeToShip: medianTimeToShipInMinutes + (distance * 60) / 15,
          distance: distanceString,
        },
      };
    });

    return updatedStores.sort((a: any, b: any) => a.timeToShip - b.timeToShip);
  };

  return {calculateTimeToShip};
};
