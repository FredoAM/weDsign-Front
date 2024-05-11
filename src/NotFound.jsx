import { useState, useEffect } from 'react';
import {Box, Container} from '@chakra-ui/react';

import Header from './Header';
import './App.css'


function App() {


const [usuario, setUsuario] = useState(null); 


useEffect(() => {
    
    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario) {
    setUsuario(JSON.parse(storedUsuario));

    }
}, []);

return (
  <Container className='container' maxW={'100%'}>
    <Header />
     {usuario ?
     <>
     <Box>
        ERROR 404  
    </Box> 
     </>
   :
   <Box>
    Inicia Sesion
   </Box> 
    }

    </Container>
  );
};

export default App;
