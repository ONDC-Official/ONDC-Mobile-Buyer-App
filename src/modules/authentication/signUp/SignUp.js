import React from 'react';
import AuthContainer from '../AuthConatiner';
import SignUpFrom from './SignUpForm';

/**
 * Component used as a sign up screen
 * @param navigation: application navigation object
 * @returns {JSX.Element}
 * @constructor
 */
const SignUp = ({navigation}) => {
  return (
    <AuthContainer onBackPress={() => navigation.goBack()}>
      <SignUpFrom navigation={navigation}/>
    </AuthContainer>
  );
};

export default SignUp;
