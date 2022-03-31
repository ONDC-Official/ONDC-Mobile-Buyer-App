import React from 'react';
import AuthContainer from '../AuthConatiner';
import LoginForm from './LoginForm';

const Login = ({navigation}) => {
  return (
    <AuthContainer onBackPress={() => navigation.goBack()}>
      <LoginForm />
    </AuthContainer>
  );
};

export default Login;
