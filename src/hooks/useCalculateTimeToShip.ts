export default () => {
  const calculateTimeToShip = (list: any) => {
    return list.map((item: any) => {
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
