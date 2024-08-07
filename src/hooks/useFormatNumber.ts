import {useTranslation} from 'react-i18next';

export default () => {
  const {i18n} = useTranslation();
  const digitMappings: any = {
    en: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
    mr: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'],
    bn: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'],
    ta: ['௦', '௧', '௨', '௩', '௪', '௫', '௬', '௭', '௮', '௯'],
  };

  const formatNumber = (number: any) => {
    const digits = String(number).split('');
    const mapping = digitMappings[i18n.language] || digitMappings.en;
    return digits
      .map(char => {
        if (char === '.') {
          return char; // keep decimal point as is
        }
        return mapping[parseInt(char, 10)];
      })
      .join('');
  };

  const formatDistance = (number: any) => {
    const input = Number(number);
    if (input >= 10) {
      return Number(input.toFixed(0));
    } else {
      return Number(input.toFixed(1));
    }
  };

  return {formatNumber, formatDistance};
};
