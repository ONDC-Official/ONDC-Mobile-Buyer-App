import React from 'react';
import AuthContainer from '../AuthConatiner';
import LoginForm from './LoginForm';

/**
 * Component used as a login screen
 * @param navigation: application navigation object
 * @returns {JSX.Element}
 * @constructor
 */
const Login = ({navigation}) => {
  return (
    <AuthContainer onBackPress={() => navigation.goBack()}>
      <LoginForm navigation={navigation} />
    </AuthContainer>
  );
};

export default Login;
