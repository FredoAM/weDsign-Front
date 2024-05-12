import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './api';
import { Flex, Container, Input, Heading, Button, Radio } from '@chakra-ui/react';
import Header from './Header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError(null);
      }, 5000); 
    }
    return () => {
      clearTimeout(timer);
    };
  }, [error]);

  const handleLogin = async () => {
    try {
      
      const validEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
      if (!validEmail) {
        setError('Please enter a valid email address');
        return;
      }

      const user = await login(email, password);
      localStorage.setItem('user', JSON.stringify({ ...user }));
      navigate(`/`)
    } catch (error) {
      setError('Incorrect email or password');
    }
  };

  return (
    <Container maxW='100%' bg='#E1D6D033' margin='auto' h={'100vh'}>
      <Header />
      <Flex
        style={{
          flexDirection: 'column',
          height: '400px',
          backgroundColor: '#FFFF',
          marginBottom: '39px',
          width: '1110.59px',
          borderRadius: '12px',
          margin: 'auto',
          border: '1px solid #DEE2E8',
          boxShadow: '0px 2px 6px 0px #00000040',
          padding: '40.16px 0 0 59px',
          gap: '15px',
        }}
      >
        <Heading>Login</Heading>
        <Input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ borderRadius: '8px', border: '1px solid #C7CCD0', width: '306px' }}
        />
        <Input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ borderRadius: '8px', border: '1px solid #C7CCD0', width: '306px' }}
        />
        <Button
          onClick={handleLogin}
          style={{
            marginTop: '20px',
            width: '177px',
            height: '48px',
            borderRadius: '4.8px',
            padding: '8px, 16px, 8px, 16px',
            backgroundColor: '#B69F97',
            color: '#FFFFFF',
            fontWeight: '300',
            fontFamily: 'Roboto',
            fontSize: '20px',
            lineHeight: '30px',
          }}
        >
          Login
        </Button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </Flex>
    </Container>
  );
};

export default Login;
