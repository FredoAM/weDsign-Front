import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx'
import NotFound from './NotFound.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      
    </ChakraProvider>
   
  </React.StrictMode>,
)
