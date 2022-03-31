import React from 'react';
import AuthContainer from '../AuthConatiner';
import SignUpFrom from './SignUpForm';

const SignUp = ({navigation}) => {
  return (
    <AuthContainer onBackPress={() => navigation.goBack()}>
      <SignUpFrom />
    </AuthContainer>
  );
};

export default SignUp;
