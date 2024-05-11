import React, {useState, useEffect} from 'react'
import { Center, Image , Flex, background} from '@chakra-ui/react';
import { CiLogout, CiLogin  } from "react-icons/ci";
import { useNavigate } from 'react-router';

export default function Header() {
  const [usuario, setUsuario] = useState(null); 
  const navigate = useNavigate();


  useEffect(() => {
    
    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario) {
      setUsuario(JSON.parse(storedUsuario));

    }
  }, []);

  const handleLogout = () => {
    const confirmacion = window.confirm('Are you sure you want to log out?');
    if (confirmacion) {
      localStorage.removeItem('usuario');
      setUsuario(null); 
      navigate('/login');
    }
    
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  return (
    
    <>
    <Flex style={{'height':'58.33px', 'backgroundColor':'#B69F97', 'marginBottom':'67.9px','width':'100%'}}>
      <Image src='/logo.png' alt='logo' height={'26.33px'} margin={'auto'} onClick={handleNavigateHome} cursor={'pointer'}/>
      {usuario ? <CiLogout onClick={handleLogout} _hover={{ color: 'white' }} style={{marginRight:'40px', alignSelf:'center', cursor:'pointer',fontSize:'40px'}} /> 
      : <CiLogin onClick={handleLogin} _hover={{ color: 'white' }} style={{marginRight:'40px', alignSelf:'center', cursor:'pointer',fontSize:'40px'}} />}
    </Flex>
    
    </>
  )
}
