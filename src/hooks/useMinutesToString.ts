import moment from 'moment';
import {useTranslation} from 'react-i18next';

export default () => {
  const {t} = useTranslation();
  const convertHoursToHoursAndMinutes = (hours: any) => {
    // Extract whole hours
    const h = Math.floor(hours);
    // Extract minutes by multiplying the decimal part by 60
    const m = Math.floor((hours - h) * 60);
    return {hours: h, minutes: m};
  };

  const convertMinutesToHumanReadable = (minutes: number) => {
    const duration = moment.duration(minutes, 'minutes');

    if (minutes >= 1440) {
      const days = Math.ceil(duration.asDays());
      return {type: 'days', time: days};
    } else if (minutes >= 60) {
      const hours = duration.asHours();
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
        if (time > 1) {
          const {hours, minutes} = convertHoursToHoursAndMinutes(time);
          return `${
            hours > 1
              ? t('Store.hours', {time: hours})
              : t('Store.hour', {time: hours})
          } ${
            minutes > 0
              ? time !== 1
                ? t('Store.minutes', {time: minutes})
                : t('Store.minute', {time: minutes})
              : ''
          }`;
        } else {
          const {hours, minutes} = convertHoursToHoursAndMinutes(time);

          return `${
            hours > 1
              ? t('Store.hours', {time: hours})
              : t('Store.hour', {time: hours})
          } ${
            minutes > 0
              ? time !== 1
                ? t('Store.minutes', {time: minutes})
                : t('Store.minute', {time: minutes})
              : ''
          }`;
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
