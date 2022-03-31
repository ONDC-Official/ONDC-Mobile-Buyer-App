import React from 'react';
import AuthContainer from '../AuthConatiner';
import LoginForm from './LoginForm';

//TODO: Documentation missing
const Login = ({navigation}) => {
  return (
    <AuthContainer onBackPress={() => navigation.goBack()}>
      <LoginForm />
    </AuthContainer>
  );
};

export default Login;
