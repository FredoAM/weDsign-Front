import React, { useState } from 'react';
import { Flex, Button, FormControl, FormLabel, Input, Heading, Container} from '@chakra-ui/react';
import { crearUsuario } from './api';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const [formData, setFormData] = useState({ usuario: '', correo: '', contraseña: '', novio: null });
  const [errorUsuario, setErrorUsuario] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState(false);
  const [errorContraseña, setErrorContraseña] = useState(false);
  

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (type === 'radio') {
      // Si es un radio, deseleccionar el otro radio
      if (name === 'esNovio' && checked) {
        setNovios({ esNovio: true, esNovia: false });
        setFormData({ ...formData, 'novio': true});
        newValue = true;
      } else if (name === 'esNovia' && checked) {
        setNovios({ esNovio: false, esNovia: true });
        setFormData({ ...formData, 'novio': false});
        newValue = true;
      }
    } else {
      setFormData({ ...formData, [name]: newValue });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.usuario.trim() === '') {
      setErrorUsuario(true);
      return;
    }
    if (formData.correo.trim() === '' || !formData.correo.includes('@')) {
      setErrorCorreo(true);
      return;
    }
    if (formData.contraseña.trim() === '') {
      setErrorContraseña(true);
      return;
    }
  
    try {
      await crearUsuario(formData);
      console.log(formData);
      setFormData({ usuario: '', correo: '', contraseña: ''});
      
      setErrorUsuario(false);
      setErrorCorreo(false);
      setErrorContraseña(false);
      alert('Usuario registrado correctamente');
      // navigate(`/login`);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert('Hubo un error al crear el usuario. Por favor, inténtalo de nuevo.');
    }
  };
  
  return (
    <Container maxW='100%' bg='#E1D6D033' margin='auto' h={'100vh'}>
      <Header />
      <Flex style={{ 'flexDirection': 'column', 'height': '500px', 'backgroundColor': '#FFFF', 'marginBottom': '39px', 'width': '1110.59px', 'borderRadius': '12px', 'margin': 'auto', 'border': '1px solid #DEE2E8', 'boxShadow': '0px 2px 6px 0px #00000040', 'padding': '40.16px 0 0 59px', 'gap': '15px' }}>
        <Heading as="h2" size="md" marginBottom="2">Registrarse</Heading>
        <FormControl onSubmit={handleSubmit}>
          <FormControl marginBottom="4" isInvalid={errorUsuario}>
            <FormLabel>Usuario</FormLabel>
            <Input type="text" name="usuario" value={formData.usuario} onChange={handleChange} />
          </FormControl>
          <FormControl marginBottom="4" isInvalid={errorCorreo}>
            <FormLabel>Correo</FormLabel>
            <Input type="email" name="correo" value={formData.correo} onChange={handleChange} />
          </FormControl>
          <FormControl marginBottom="4" isInvalid={errorContraseña}>
            <FormLabel>Contraseña</FormLabel>
            <Input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} />
          </FormControl>
          {/* <Flex gap={'20px'}>
            <Radio name="esNovio" isChecked={novios.esNovio} onChange={handleChange} style={{ color: '#000000', fontFamily: 'Roboto', fontSize: '14px' }}>Novio</Radio>
            <Radio name="esNovia" isChecked={novios.esNovia} onChange={handleChange} style={{ color: '#000000', fontFamily: 'Roboto', fontSize: '14px' }}>Novia</Radio>
          </Flex> */}
          <Button type="submit" onClick={handleSubmit} style={{ 'marginTop': '20px', 'width': '177px', 'height': '48px', 'borderRadius': '4.8px', 'padding': '8px, 16px, 8px, 16px', 'backgroundColor': '#B69F97', 'color': '#FFFFFF', 'fontWeight': '300', 'fontFamily': 'Roboto', 'fontSize': '20px', 'lineHeight': '30px' }}>Registrarse</Button>
        </FormControl>
      </Flex>
    </Container>
  );
};

export default Registro;
