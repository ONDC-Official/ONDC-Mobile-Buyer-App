import {useRef, useState} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';

import {
  MODEL_PIPELINE_ENDPOINT,
  PIPELINE_ID,
  ULCA_API_KEY,
  ULCA_BASE_URL,
  ULCA_USER_ID,
} from '../utils/apiActions';
import useNetworkErrorHandling from './useNetworkErrorHandling';

export default () => {
  const {handleApiError} = useNetworkErrorHandling();
  const {language} = useSelector(({auth}) => auth);
  const [transliterationRequest, setTransliterationRequest] = useState({
    callbackUrl: '',
    authorizationKey: '',
    authorizationValue: '',
    serviceId: '',
  });
  const transliterationRequestRef = useRef({
    callbackUrl: '',
    authorizationKey: '',
    authorizationValue: '',
    serviceId: '',
  });

  const withoutConfigRequest = async () => {
    const payload = {
      pipelineTasks: [
        {
          taskType: 'translation',
        },
      ],
      pipelineRequestConfig: {
        pipelineId: PIPELINE_ID,
      },
    };
    const config = {
      headers: {
        ulcaApiKey: ULCA_API_KEY,
        userID: ULCA_USER_ID,
      },
    };

    try {
      const {data} = await axios.post(
        `${ULCA_BASE_URL}${MODEL_PIPELINE_ENDPOINT}`,
        payload,
        config,
      );

      const transliterationIndex =
        data?.pipelineResponseConfig[0].config.findIndex(
          (item: {language: {sourceLanguage: string}}) =>
            item?.language.sourceLanguage === language,
        );

      const response = {
        callbackUrl: data?.pipelineInferenceAPIEndPoint?.callbackUrl,
        authorizationKey:
          data?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name,
        authorizationValue:
          data?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value,
        serviceId:
          data?.pipelineResponseConfig[0].config[transliterationIndex]
            .serviceId,
      };

      transliterationRequestRef.current = response;
      setTransliterationRequest(response);
    } catch (e) {
      console.log(e);
      handleApiError(e);
    }
  };

  const computeRequestTransliteration = async (source: string) => {
    const {callbackUrl, authorizationKey, authorizationValue, serviceId} =
      transliterationRequestRef.current;

    const payload = {
      pipelineTasks: [
        {
          taskType: 'translation',
          config: {
            language: {
              sourceLanguage: language,
              targetLanguage: 'en',
            },
            serviceId,
          },
        },
      ],
      inputData: {
        input: [
          {
            source,
          },
        ],
      },
    };

    const config = {
      headers: {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        [authorizationKey]: authorizationValue,
      },
    };

    try {
      const {data} = await axios.post(callbackUrl, payload, config);
      return data;
    } catch (e) {
      handleApiError(e);
    }
  };

  return {
    withoutConfigRequest,
    computeRequestTransliteration,
    transliterationRequest,
  };
};
