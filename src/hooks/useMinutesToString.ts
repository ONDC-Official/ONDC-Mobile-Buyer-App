import moment from 'moment';
import {useTranslation} from 'react-i18next';

export default () => {
  const {t} = useTranslation();
  const convertMinutesToHumanReadable = (minutes: number) => {
    const duration = moment.duration(minutes, 'minutes');

    if (minutes >= 1440) {
      const days = Math.ceil(duration.asDays());
      return {type: 'days', time: days};
    } else if (minutes >= 60) {
      const hours = Math.ceil(duration.asHours());
      return {type: 'hours', time: hours};
    } else {
      return {type: 'minutes', time: Math.ceil(minutes)};
    }
  };

  const translateMinutesToHumanReadable = (type: string, time: number) => {
    switch (type) {
      case 'days':
        if (time !== 1) {
          return t('Store.days', {time: time});
        } else {
          return t('Store.day', {time: time});
        }

      case 'hours':
        if (time !== 1) {
          return t('Store.hours', {time: time});
        } else {
          return t('Store.hour', {time: time});
        }

      default:
        if (time !== 1) {
          return t('Store.minutes', {time: time});
        } else {
          return t('Store.minute', {time: time});
        }
    }
  };

  return {convertMinutesToHumanReadable, translateMinutesToHumanReadable};
};
