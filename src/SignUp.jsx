import React, { useState } from 'react';
import { Flex, Button, FormControl, FormLabel, Input, Heading, Container} from '@chakra-ui/react';
import { createUser } from './api';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({ user: '', email: '', password: '', novio: null });
  const [errorUser, setErrorUser] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  

  //const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value} = e.target;
    let newValue = value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.user.trim() === '') {
      setErrorUser(true);
      return;
    }
    if (formData.email.trim() === '' || !formData.email.includes('@')) {
      setErrorEmail(true);
      return;
    }
    if (formData.password.trim() === '') {
      setErrorPassword(true);
      return;
    }
  
    try {
      await createUser(formData);
      console.log(formData);
      setFormData({ user: '', email: '', password: ''});
      
      setErrorUser(false);
      setErrorEmail(false);
      setErrorPassword(false);
      alert('User successfully registered');
      // navigate(`/login`);
    } catch (error) {
      console.error('Error creating user:', error);
      alert('There was an error creating the user. Please try again.');
    }
  };
  
  return (
    <Container maxW='100%' bg='#E1D6D033' margin='auto' h={'100vh'}>
      <Header />
      <Flex style={{ 'flexDirection': 'column', 'height': '500px', 'backgroundColor': '#FFFF', 'marginBottom': '39px', 'width': '1110.59px', 'borderRadius': '12px', 'margin': 'auto', 'border': '1px solid #DEE2E8', 'boxShadow': '0px 2px 6px 0px #00000040', 'padding': '40.16px 0 0 59px', 'gap': '15px' }}>
        <Heading as="h2" size="md" marginBottom="2">Sign Up</Heading>
        <FormControl onSubmit={handleSubmit}>
          <FormControl marginBottom="4" isInvalid={errorUser}>
            <FormLabel>User</FormLabel>
            <Input type="text" name="user" value={formData.user} onChange={handleChange} />
          </FormControl>
          <FormControl marginBottom="4" isInvalid={errorEmail}>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} />
          </FormControl>
          <FormControl marginBottom="4" isInvalid={errorPassword}>
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" value={formData.password} onChange={handleChange} />
          </FormControl>
          <Button type="submit" onClick={handleSubmit} style={{ 'marginTop': '20px', 'width': '177px', 'height': '48px', 'borderRadius': '4.8px', 'padding': '8px, 16px, 8px, 16px', 'backgroundColor': '#B69F97', 'color': '#FFFFFF', 'fontWeight': '300', 'fontFamily': 'Roboto', 'fontSize': '20px', 'lineHeight': '30px' }}>Registrarse</Button>
        </FormControl>
      </Flex>
    </Container>
  );
};

export default SignUp;
