import moment from 'moment';
import 'moment/locale/hi';
import 'moment/locale/mr';
import 'moment/locale/bn';
import 'moment/locale/ta';
import {useTranslation} from 'react-i18next';

export default () => {
  const {i18n} = useTranslation();

  const formatDate = (date: moment.Moment, format: string) => {
    return date.locale(i18n.language).format(format);
  };

  return {formatDate};
};
