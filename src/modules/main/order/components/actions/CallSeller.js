import React from 'react';

import ClearButton from '../../../../../components/button/ClearButton';

const CallSeller = () => {
  return (
    <>
      <ClearButton
        title={'Call'}
        onPress={getSupport}
        textColor={colors.primary}
        disabled={callInProgress}
        loading={callInProgress}
      />
    </>
  );
};
