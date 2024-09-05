import {showToastWithGravity} from '../utils/utils';
import auth from '@react-native-firebase/auth';

const useHandlePhoneVerification = () => {
  const handleVerificationError = (code: string) => {
    switch (code) {
      case 'auth/invalid-verification-code':
        showToastWithGravity('Enter valid OTP');
        break;
      case 'auth/missing-verification-code':
        showToastWithGravity('Please enter OTP');
        break;
      case 'auth/quota-exceeded':
        showToastWithGravity('Limit exceed, please try after some time');
        break;
      case 'auth/session-expired':
        showToastWithGravity('Entered OTP is expired, please request new OTP');
        break;
      case 'auth/invalid-verification-id':
      case 'auth/too-many-requests':
        showToastWithGravity(
          'Something went wrong please try again after some time',
        );
        break;
      case 'auth/user-disabled':
        showToastWithGravity('Account is disabled, please contact admin');
        break;
    }
  };

  const sendOtp = async (
    mobileNumber: string,
    setApiInProgress: (value: boolean) => void,
    setConfirmation: (value: any) => void,
    setCodeAvailable: (value: boolean) => void,
  ) => {
    try {
      setApiInProgress(true);
      const confirm = await auth().signInWithPhoneNumber(
        `+91${mobileNumber}`,
        true,
      );
      setConfirmation(confirm);
      setCodeAvailable(true);
    } catch (error: any) {
      if (error?.code === 'auth/invalid-phone-number') {
        showToastWithGravity('Please enter valid phone number');
      } else if (error?.code === 'auth/too-many-requests') {
        showToastWithGravity(
          'We have blocked all requests from this device due to unusual activity. Try again later',
        );
      } else {
        showToastWithGravity(error.message);
      }
    } finally {
      setApiInProgress(false);
    }
  };

  return {handleVerificationError, sendOtp};
};

export default useHandlePhoneVerification;
