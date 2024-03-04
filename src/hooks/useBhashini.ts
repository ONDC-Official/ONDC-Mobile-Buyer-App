import {useState} from 'react';
import axios from 'axios';
import {
  MODEL_PIPELINE_ENDPOINT,
  PIPELINE_ID,
  ULCA_API_KEY,
  ULCA_BASE_URL,
  ULCA_USER_ID,
} from '../utils/apiActions';
import useNetworkErrorHandling from './useNetworkErrorHandling';

const BHASHINI_SOURCE_LANG = 'en';

export default () => {
  const {handleApiError} = useNetworkErrorHandling();
  const [asrRequest, setAsrRequest] = useState({
    callback_url: '',
    compute_call_authorization_key: '',
    compute_call_authorization_value: '',
    asr_service_id: '',
  });

  const withoutConfigRequest = async () => {
    const payload = {
      pipelineTasks: [
        {
          taskType: 'asr',
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

      const index = data?.pipelineResponseConfig[0].config.findIndex(
        (item: {language: {sourceLanguage: string}}) =>
          item?.language.sourceLanguage === BHASHINI_SOURCE_LANG,
      );

      setAsrRequest({
        callback_url: data?.pipelineInferenceAPIEndPoint?.callbackUrl,
        compute_call_authorization_key:
          data?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.name,
        compute_call_authorization_value:
          data?.pipelineInferenceAPIEndPoint?.inferenceApiKey?.value,
        asr_service_id: data?.pipelineResponseConfig[0].config[index].serviceId,
      });
    } catch (e) {
      handleApiError(e);
    }
  };

  const computeRequestASR = async (base64: string) => {
    const {
      callback_url,
      compute_call_authorization_key,
      compute_call_authorization_value,
      asr_service_id,
    } = asrRequest;

    const payload = {
      pipelineTasks: [
        {
          taskType: 'asr',
          config: {
            language: {
              sourceLanguage: BHASHINI_SOURCE_LANG,
            },
            serviceId: asr_service_id,
            audioFormat: 'wav',
            samplingRate: 16000,
          },
        },
      ],
      inputData: {
        audio: [
          {
            audioContent: base64,
          },
        ],
      },
    };

    const config = {
      headers: {
        Accept: '*/*',
        'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        [compute_call_authorization_key]: compute_call_authorization_value,
      },
    };

    try {
      const {data} = await axios.post(callback_url, payload, config);
      return data;
    } catch (e) {
      handleApiError(e);
    }
  };

  return {withoutConfigRequest, computeRequestASR};
};
