import {useTranslation} from 'react-i18next';

export default () => {
  const {t} = useTranslation();

  const getSubcategoryName = (value: string, label: string) => {
    const name = t(`Product SubCategories.${label}`);
    if (name.includes('Product SubCategories.')) {
      return label;
    } else {
      return name;
    }
  };

  return {getSubcategoryName};
};
