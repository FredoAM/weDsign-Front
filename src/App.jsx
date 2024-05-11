import { useState, useEffect } from 'react';
import {Heading, Box, Container, Flex, Text, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, Select , NumberDecrementStepper, FormControl, FormLabel, Button, Input, useMediaQuery, Spacer, UnorderedList, ListItem } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { getInvitaciones, crearInvitacion, eliminarInvitacion, editarInvitacion } from './api';
import Header from './Header';
import * as XLSX from 'xlsx';
import './App.css'


function App() {
  const [formData, setFormData] = useState({ nombre: '',  telefono: '', cantidadInvitados: 0, familiar: false,  pendiente: true, invitadosDe: 'Ambos'});
  const [updateData, setUpdateData] = useState({ nombre: '',  telefono: '', cantidadInvitados: 0});
  const [invitaciones, setInvitaciones] = useState([]);
  const [errorNombre, setErrorNombre] = useState(false);
  const [usuario, setUsuario] = useState(null); 
  const [editingId, setEditingId] = useState(null);

  const [medio] = useMediaQuery('(min-width: 1140px)');
  const [chico] = useMediaQuery('(min-width: 660px)');

  useEffect(() => {
    async function fetchInvitaciones() {
      const data = await getInvitaciones();
      setInvitaciones(data);
    }
    fetchInvitaciones();

    const storedUsuario = localStorage.getItem('usuario');
    if (storedUsuario) {
      setUsuario(JSON.parse(storedUsuario));

    }
  }, []);

  
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
  

    if (name === 'telefono') {
      const telefonoRegex = /^\d{0,12}$/; 
      if (!telefonoRegex.test(value)) {
        return;
      }
    }
    if (name === 'invitadosDe') {
      setFormData({ ...formData, invitadosDe: value });
    } else {
      setFormData({ ...formData, [name]: newValue });
    }
  };

  const handleEnviar = async () => {
    if (formData.nombre.trim() === '') {
      setErrorNombre(true);
      return;
    }
    const randomId = uuidv4();
    const nuevaInvitacion = { id:randomId , ...formData , usuarioId:usuario.id, novio: formData.invitadosDe };
    await crearInvitacion(nuevaInvitacion);
    setInvitaciones([...invitaciones, nuevaInvitacion]);
    setFormData({ nombre: '',  telefono: '', cantidadInvitados: 0, familiar: false, invitadosDe: 'Ambos'});
    setErrorNombre(false);
  };


  const handleDescargarLista = () => {
    const usuarioId = usuario ? usuario.id : null;
    const data = invitaciones
      .filter(inv => inv.usuarioId === usuarioId) 
      .map(inv => ({
        Name: inv.nombre,
        Family: inv.familiar ? 'Familia' : 'No',
        Phone: inv.telefono,
        'Number of Guests': inv.cantidadInvitados,
        'Attendance': inv.pendiente ? 'Pendiente' : inv.asistencia ? 'Yes' : 'No',
        Pending: inv.pendiente ? 'Yes' : 'No',
        'Guest of': inv.novio === 'Novio' ? 'Groom' : inv.novio === 'Novia'? 'Bride' :'Both'
      }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invitados');
    XLSX.writeFile(wb, 'guest_list.xlsx');

  };
  

  const handleEditar = (invitacion) => {
    setEditingId(invitacion.id);
    setUpdateData({ ...invitacion });
  };

  const handleCancelarEdicion = () => {
    setEditingId(null);
    setFormData({ nombre: '',  telefono: '', cantidadInvitados: 0});
  };

  const handleActualizar = async () => {
    await editarInvitacion(updateData.id, updateData);
    const index = invitaciones.findIndex((invitacion) => invitacion.id === updateData.id);
    if (index !== -1) {
      const updatedInvitaciones = [...invitaciones];
      updatedInvitaciones[index] = updateData;
      setInvitaciones(updatedInvitaciones);
    }
    setEditingId(null);
    setUpdateData({ nombre: '', telefono: '', cantidadInvitados: 0});
  };

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm('Are you sure you want to delete this invitation?');
    if (confirmacion) {
        await eliminarInvitacion(id);
        setInvitaciones(invitaciones.filter((invitacion) => invitacion.id !== id));
    }
};


  const writeClipboardText = async(text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error(error.message);
    }
  }

  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setUpdateData({ ...updateData, [name]: newValue });
  };

return (
  <Container className='container' maxW={'100%'}>
    <Header />
     {usuario ?
     <>
     <Box style={{'height':medio ? '420px' : '620px', 'backgroundColor':'#FFFF', 'marginBottom':'39px', width: medio ? '1110.59px' : chico ? '740.59px' : '340px','borderRadius':'12px', 'margin':'auto','border':'1px solid #DEE2E8','boxShadow': '0px 2px 6px 0px #00000040'}}>
     <Heading style={{'padding':'12.43px 0 16.25px 20.13px','fontSize':'20px','lineHeight':'28px','fontWeight':'400' ,'color':'#000000','fontFamily':'Roboto'}}>Create a new invitation</Heading>
     <hr />
     <Box style={{'padding': chico ? '40.16px 0 0 59px' : '40.16px 0 0 15px'}}>
       <FormControl action="">
         <Flex style={{'gap':'31px'}} flexDirection={medio ? 'row' : 'column'}>
           <Box style={{'width':'306px'}}> 
               {!formData.familiar ? 
                 <>
                 <FormLabel htmlFor="nombre" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Guest Name</FormLabel>
                 <Input name="nombre" type="text" value={formData.nombre} onChange={handleChange} isInvalid={errorNombre} style={{'borderRadius':'8px','border':'1px solid #C7CCD0'}} placeholder='Full Name'/>
                 {errorNombre && (
                     <Text color="red.500" fontSize="sm">
                     Please fill out this field
                     </Text>
                 )}
                 </>
                 :
                 <>
                 <FormLabel htmlFor="nombre" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Guest Family Name</FormLabel>
                 <Input name="nombre" type="text" value={formData.nombre} onChange={handleChange} isInvalid={errorNombre} style={{'borderRadius':'8px','border':'1px solid #C7CCD0'}} placeholder='Family Name'/>
                 {errorNombre && (
                     <Text color="red.500" fontSize="sm">
                     Please fill out this field
                     </Text>
                 )}
                 </>
                 
               }
           </Box>
           <Box style={{'width':'306px'}}>
             <FormLabel htmlFor="telefono" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Phone</FormLabel>
             <Input name="telefono" type="text" value={formData.telefono}  onChange={handleChange} style={{'borderRadius':'8px','border':'1px solid #C7CCD0'}} placeholder='+52 1 56 53 28 08 94'/>
           </Box>
           <Box style={{'width':'306px'}}>
             <FormLabel htmlFor="cantidadInvitados" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Number of Guests</FormLabel>
             <NumberInput name="cantidadInvitados" defaultValue={0} min={0} max={15} value={formData.cantidadInvitados} style={{'borderRadius':'8px','border':'1px solid #C7CCD0'}} onChange={(valueString) => setFormData({ ...formData, cantidadInvitados: parseInt(valueString) })}>
               <NumberInputField />
               <NumberInputStepper>
                 <NumberIncrementStepper />
                 <NumberDecrementStepper />
               </NumberInputStepper>
             </NumberInput>
           </Box>
         </Flex>
         <Flex style={{'margin':'26.45px 0 31px 0', 'gap':'10px'}}>
             <input type="checkbox" name="familiar" onChange={handleChange} style={{'color':'#000000', 'borderRadius':'50%', 'border': '1px solid #B69F97', 'cursor':'pointer'}} />
             <Text style={{'color':'#000000','fontFamily':'Roboto','fontSize':'14px'}}>Check this box to indicate that this invitation is for an entire family</Text>
         </Flex>
         <Box style={{'width':'206px','marginBottom':'20px'}}>
             <FormLabel htmlFor="cantidadInvitados" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Guest of:</FormLabel>
             <Select name="invitadosDe"   onChange={handleChange}  style={{'borderRadius':'8px','border':'1px solid #C7CCD0', 'fontFamily':'Roboto'}}>
               <option value='Ambos'>Both</option>
               <option value='Novio'>Groom</option>
               <option value='Novia'>Bride</option>
             </Select>
           </Box>
         <Button onClick={handleEnviar} backgroundColor={'#B69F97'} style={{'width':'177px','height':'48px','borderRadius':'4.8px','padding':'8px, 16px, 8px, 16px','color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px',}} _hover={{opacity:'0.5'}}>
           Save
         </Button>
       </FormControl>
     </Box>
   </Box>
   <br />
   <br />
   <br />
   <Box style={{ 'backgroundColor':'#FFFF',  width: medio ? '1110.59px' : chico ? '740.59px' : '340px','borderRadius':'12px', 'margin':'auto','border':'1px solid #DEE2E8','boxShadow': '0px 2px 6px 0px #00000040'}}>
     <Heading style={{'padding':'12.43px 0 16.25px 20.13px','fontSize':'20px','lineHeight':'28px','fontWeight':'400' ,'color':'#000000','fontFamily':'Roboto'}}>Guest list</Heading>
     
     <hr />
     <Flex  style={{'width':'100%','padding': chico ? '40.16px 0 0 59px' : '40.16px 0 0 15px','gap':'48px'}} flexDirection={medio ? 'row' : 'column'}>
       <Flex flexDirection={'column'} width={'150px'}>
         <Text style={{'fontSize':'14px', 'fontFamily':'Roboto','fontWeight':'400' ,'marginBottom':'7px'}} >Pending Confirmation</Text >
         <Flex style={{'margin':'auto','borderRadius':'8px', 'height':'41px' , 'backgroundColor':'#E1D6D0', 'width':'150px'}}>
           <Text style={{'fontSize':'16px','fontWeight':'500','fontFamily':'Roboto','lineHeight':'22.4px' ,'margin':'auto'}}>
             {invitaciones.filter(inv => inv.usuarioId === usuario?.id && inv.pendiente).reduce((total, inv) => total + inv.cantidadInvitados, 0)}
           </Text>
         </Flex >
       </Flex>
       <Flex flexDirection={'column'} width={'150px'}>
         <Text style={{'fontSize':'14px', 'fontFamily':'Roboto','fontWeight':'400' ,'marginBottom':'7px'}} >Not Attending</Text >
         <Flex style={{'margin':'auto','borderRadius':'8px', 'height':'41px' , 'backgroundColor':'#E1D6D0', 'width':'150px'}}>
           <Text style={{'fontSize':'16px','fontWeight':'500','fontFamily':'Roboto','lineHeight':'22.4px' ,'margin':'auto'}}>
             {invitaciones.filter(inv => inv.usuarioId === usuario?.id && inv.asistencia === false).reduce((total, inv) => total + inv.cantidadInvitados, 0)}
           </Text>
         </Flex >
       </Flex>
       <Flex flexDirection={'column'} width={'150px'}>
         <Text style={{'fontSize':'14px', 'fontFamily':'Roboto','fontWeight':'400' ,'marginBottom':'7px'}}>Will Attend</Text >
         <Flex style={{'margin':'auto','borderRadius':'8px', 'height':'41px' , 'backgroundColor':'#E1D6D0', 'width':'150px'}}>
           <Text style={{'fontSize':'16px','fontWeight':'500','fontFamily':'Roboto','lineHeight':'22.4px' ,'margin':'auto'}}>
             { invitaciones.filter(inv => inv.usuarioId === usuario?.id && inv.asistencia === true).reduce((total, inv) => total + inv.cantidadInvitados, 0)}
           </Text>
         </Flex >
       </Flex>
       <Flex flexDirection={'column'} width={'276px'}>
         <Text style={{'fontSize':'20px','fontWeight':'700','fontFamily':'Roboto','lineHeight':'28px' ,'margin':'auto', 'marginBottom':'9px'}}>
          Registered Guests : { invitaciones.filter(inv => inv.usuarioId === usuario?.id).reduce((total, inv) => total + inv.cantidadInvitados, 0)}
         </Text >
         <Button onClick={handleDescargarLista} style={{'height':'48px','borderRadius':'4.8px','padding':'8px, 16px, 8px, 16px','backgroundColor':'#B69F97','color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}}>Download guest list</Button>
       </Flex>
     </Flex>
     <br />
     <hr />
     <Box style={{'width':'100%','padding': chico ? '40.16px 0 0 59px' : '40.16px 0 0 0px' , 'maxHeight': chico ? '430px' : '500px', 'overflowY': 'auto', 'overflowX' :'hidden'}}>
       <Heading style={{'padding':'12.43px 0 16.25px 20.13px','fontSize':'20px','lineHeight':'28px','fontWeight':'400' ,'color':'#000000','fontFamily':'Roboto'}}>Guests</Heading>
       
       <br />
       <UnorderedList w={'100%'}>
         {invitaciones.filter(invitacion => invitacion.usuarioId === usuario?.id).map((invitacion) => (
           <Box key={invitacion.id} >
             <ListItem key={invitacion.id} w='100%' display={'flex'} color={'black'} marginBottom={'50px'} flexDirection={chico ? 'row' : 'column'} gap={chico ? 0 : '25px'}>
               { editingId === invitacion.id ?
                 <Box w={chico ? '40%' : '100%'}>
                 <FormLabel htmlFor="cantidadInvitados" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Name</FormLabel>
                 <Input name="nombre" mb={'10px'} onChange={handleUpdateChange} style={{'borderRadius':'8px','border':'1px solid #C7CCD0' , width : chico ? '322px' : '300px'}} value={updateData.nombre}  />
                 <FormLabel htmlFor="cantidadInvitados" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Phone</FormLabel>
                 <Input name="telefono" mb={'10px'}  onChange={handleUpdateChange} style={{'borderRadius':'8px','border':'1px solid #C7CCD0', width : chico ? '322px' : '300px'}} value={updateData.telefono}  />
                 <FormLabel htmlFor="cantidadInvitados" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Number of Guests</FormLabel>
                 <NumberInput name="cantidadr" defaultValue={0} min={0} max={15} value={updateData.cantidadInvitados} style={{'borderRadius':'8px','border':'1px solid #C7CCD0', 'marginBlock':'15px', width : chico ? '322px' : '300px'}} onChange={(valueString) => setUpdateData({ ...updateData, cantidadInvitados: parseInt(valueString) })}  >
                   <NumberInputField />
                   <NumberInputStepper>
                     <NumberIncrementStepper />
                     <NumberDecrementStepper />
                   </NumberInputStepper>
                 </NumberInput>
                 <Flex gap={'15px'}>
                   <Button onClick={() => handleActualizar(invitacion)} backgroundColor={'#B69F97'} style={{'color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}} _hover={{opacity:'0.5'}}>Update</Button>
                   <Button onClick={() => handleCancelarEdicion(invitacion)} backgroundColor={'#B69F97'} style={{'color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}} _hover={{opacity:'0.5'}}>Cancel</Button>
                   <Button onClick={() => handleEliminar(invitacion.id)} backgroundColor={'#B69F97'} style={{'color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}} _hover={{opacity:'0.5'}}>Delete</Button>
                 </Flex>
               </Box>
               :
               <Box w={chico ? '40%' : '100%'}>
                 <FormLabel htmlFor="cantidadInvitados" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Name</FormLabel>
                 <Text mb={'10px'} style={{'borderRadius':'8px','border':'1px solid #C7CCD0', 'padding':'7px', width : chico ? '322px' : '300px'}}>{invitacion.nombre}</Text>
                 <FormLabel htmlFor="cantidadInvitados" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Phone</FormLabel>
                 <Text mb={'10px'} style={{'borderRadius':'8px','border':'1px solid #C7CCD0', 'padding':'7px', width : chico ? '322px' : '300px'}}>{invitacion.telefono}</Text>
                 <FormLabel htmlFor="cantidadInvitados" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Number of Guests</FormLabel>
                 <Text mb={'10px'} style={{'borderRadius':'8px','border':'1px solid #C7CCD0', 'padding':'7px', width : chico ? '322px' : '300px'}}>{invitacion.cantidadInvitados}</Text>
                 <Flex gap={'15px'}>
                   <Button  onClick={() => writeClipboardText(`http://localhost:5174/confirmacion/${invitacion.id}`)} backgroundColor={'#B69F97'} style={{'color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}} _hover={{opacity:'0.5'}}> {medio ? 'Copy link' : 'Copy'}</Button>
                   <Button onClick={() => handleEditar(invitacion)} backgroundColor={'#B69F97'} style={{'color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}} _hover={{opacity:'0.5'}}>Edit</Button>
                   <Button onClick={() => handleEliminar(invitacion.id)}  backgroundColor={'#B69F97'} style={{'color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}} _hover={{opacity:'0.5'}}>Delete</Button>
                 </Flex>
               </Box>
               }
               <Flex  style={{'width':'60%', 'justifyContent':'center'} }>
                 <Flex flexDirection={'column'} width={'150px'}>
                   <Text style={{'fontSize':'14px', 'fontFamily':'Roboto','fontWeight':'400' ,'marginBottom':'7px','margin':'auto'}} >Status</Text >
                   <Flex style={{'margin':'auto','borderRadius':'8px', 'height':'41px' , 'backgroundColor':'#E1D6D0', 'width':'150px'}}>
                     <Text style={{'fontSize':'16px','fontWeight':'500','fontFamily':'Roboto','lineHeight':'22.4px' ,'margin':'auto'}}>
                       {invitacion.pendiente ? 'Pending' : invitacion.asistencia ? 'Will Attend' : 'Not Attending'}
                     </Text>
                   </Flex >
                 </Flex>
               </Flex>
             </ListItem>
             <hr className='acherre'/>
             <br />
           </Box>
         ))}
       </UnorderedList>
     </Box>
     
   </Box>
     </>
   :
   <Box>
    Log in
   </Box> 
    }

    </Container>
  );
};

export default App;
