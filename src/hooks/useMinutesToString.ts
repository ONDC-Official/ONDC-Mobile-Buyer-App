import moment from 'moment';
import {useTranslation} from 'react-i18next';

export default () => {
  const {t} = useTranslation();

  const convertToRange = (value: number) => {
    const lower = Math.floor(value);
    const higher = lower + 1;
    return {lower, higher};
  };

  const convertMinutesToHumanReadable = (minutes: number) => {
    const duration = moment.duration(minutes, 'minutes');

    if (minutes >= 1440) {
      const days = duration.asDays();
      return {type: 'days', time: days};
    } else if (minutes >= 60) {
      const hours = duration.asHours();
      return {type: 'hours', time: hours};
    } else {
      return {type: 'minutes', time: minutes};
    }
  };

  const translateMinutesToHumanReadable = (type: string, time: number) => {
    const {lower, higher} = convertToRange(time);
    switch (type) {
      case 'days':
        return t('Store.days', {time: `${lower}-${higher}`});

      case 'hours':
        return t('Store.hours', {time: `${lower}-${higher}`});

      default:
        return t('Store.minutes', {time: lower});
    }
  };

  return {convertMinutesToHumanReadable, translateMinutesToHumanReadable};
};
