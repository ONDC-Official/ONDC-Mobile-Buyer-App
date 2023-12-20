import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {API_BASE_URL, CUSTOM_MENU, ITEMS} from '../../../../utils/apiActions';
import useNetworkHandling from '../../../../hooks/useNetworkHandling';
import useNetworkErrorHandling from '../../../../hooks/useNetworkErrorHandling';
import ProductSkeleton from '../../../../components/skeleton/ProductSkeleton';
import CustomMenuAccordion from './CustomMenuAccordion';

interface FBProducts {
  provider: string;
  domain: string;
}

const CancelToken = axios.CancelToken;
const FBProducts: React.FC<FBProducts> = ({provider, domain}) => {
  const customMenuSource = useRef<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const [menuRequested, setMenuRequested] = useState<boolean>(true);
  const {getDataWithAuth} = useNetworkHandling();
  const {handleApiError} = useNetworkErrorHandling();

  const getCustomMenu = async () => {
    try {
      setMenuRequested(true);
      customMenuSource.current = CancelToken.source();
      const {data} = await getDataWithAuth(
        `${API_BASE_URL}${CUSTOM_MENU}?provider=${provider}&domain=${domain}`,
        customMenuSource.current.token,
      );
      const menuResponses = await Promise.all(
        data.data.map((one: any) =>
          getDataWithAuth(
            `${API_BASE_URL}${ITEMS}?customMenu=${one.id}`,
            customMenuSource.current.token,
          ),
        ),
      );
      setMenu(
        data.data.map((one: any, index: number) => {
          one.items = menuResponses[index].data.data;
          return one;
        }),
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setMenuRequested(false);
    }
  };

  useEffect(() => {
    getCustomMenu().then(() => {});

    return () => {
      if (customMenuSource.current) {
        customMenuSource.current.cancel();
      }
    };
  }, []);

  if (menuRequested) {
    return (
      <>
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
        <ProductSkeleton />
      </>
    );
  }

  return menu.map(section => (
    <CustomMenuAccordion key={section.id} section={section} />
  ));
};

export default FBProducts;
