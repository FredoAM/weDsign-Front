import { useState, useEffect } from 'react';
import {Heading, Box, Container, Flex, Text, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, Select , NumberDecrementStepper, FormControl, FormLabel, Button, Input, useMediaQuery, Spacer, UnorderedList, ListItem } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { getInvitations, createInvitation, deleteInvitation, editInvitation } from './api';
import Header from './Header';
import * as XLSX from 'xlsx';
import './App.css'


function App() {
  const [formData, setFormData] = useState({ name: '',  phone: '', numberOfGuests: 0, family: false,  pending: true, type: 'Both'});
  const [updateData, setUpdateData] = useState({ name: '',  phone: '', numberOfGuests: 0});
  const [invitations, setInvitations] = useState([]);
  const [errorName, setErrorName] = useState(false);
  const [user, setUser] = useState(null); 
  const [editingId, setEditingId] = useState(null);

  const [medium] = useMediaQuery('(min-width: 1140px)');
  const [small] = useMediaQuery('(min-width: 660px)');

  useEffect(() => {
    async function fetchInvitations() {
      const data = await getInvitations();
      setInvitations(data);
    }
    fetchInvitations();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));

    }
  }, []);

  
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
  

    if (name === 'phone') {
      const phoneRegex = /^\d{0,12}$/; 
      if (!phoneRegex.test(value)) {
        return;
      }
    }
    if (name === 'guestOf') {
      setFormData({ ...formData, guestOf: value });
    } else {
      setFormData({ ...formData, [name]: newValue });
    }
  };

  const handleSend = async () => {
    if (formData.name.trim() === '') {
      setErrorName(true);
      return;
    }
    const randomId = uuidv4();
    const newInvitation = { id:randomId , ...formData , userId:user.id, type: formData.guestOf };
    await createInvitation(newInvitation);
    setInvitations([...invitations, newInvitation]);
    setFormData({ name: '',  phone: '', numberOfGuests: 0, family: false, guestOf: 'Both'});
    setErrorName(false);
  };


  const handleDownloadList = () => {
    const userId = user ? user.id : null;
    const data = invitations
      .filter(inv => inv.userId === userId) 
      .map(inv => ({
        Name: inv.name,
        Family: inv.family ? 'Family' : 'No',
        Phone: inv.phone,
        'Number of Guests': inv.numberOfGuests,
        'Attendance': inv.pending ? 'Pending' : inv.attendance ? 'Yes' : 'No',
        Pending: inv.pending ? 'Yes' : 'No',
        'Guest of': inv.type === 'Groom' ? 'Groom' : inv.type === 'Bride'? 'Bride' :'Both'
      }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Guests');
    XLSX.writeFile(wb, 'guest_list.xlsx');

  };
  

  const handleEdit = (invitation) => {
    setEditingId(invitation.id);
    setUpdateData({ ...invitation });
  };

  const handleCancelSend = () => {
    setEditingId(null);
    setFormData({ name: '',  phone: '', numberOfGuests: 0});
  };

  const handleUpdate = async () => {
    await editInvitation(updateData.id, updateData);
    const index = invitations.findIndex((invitation) => invitation.id === updateData.id);
    if (index !== -1) {
      const updatedInvitations = [...invitations];
      updatedInvitations[index] = updateData;
      setInvitations(updatedInvitations);
    }
    setEditingId(null);
    setUpdateData({ name: '', phone: '', numberOfGuests: 0});
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this invitation?');
    if (confirm) {
        await deleteInvitation(id);
        setInvitations(invitations.filter((invitation) => invitation.id !== id));
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
     {user ?
     <>
     <Box style={{'height':medium ? '420px' : '620px', 'backgroundColor':'#FFFF', 'marginBottom':'39px', width: medium ? '1110.59px' : small ? '740.59px' : '340px','borderRadius':'12px', 'margin':'auto','border':'1px solid #DEE2E8','boxShadow': '0px 2px 6px 0px #00000040'}}>
     <Heading style={{'padding':'12.43px 0 16.25px 20.13px','fontSize':'20px','lineHeight':'28px','fontWeight':'400' ,'color':'#000000','fontFamily':'Roboto'}}>Create a new invitation</Heading>
     <hr />
     <Box style={{'padding': small ? '40.16px 0 0 59px' : '40.16px 0 0 15px'}}>
       <FormControl action="">
         <Flex style={{'gap':'31px'}} flexDirection={medium ? 'row' : 'column'}>
           <Box style={{'width':'306px'}}> 
               {!formData.family ? 
                 <>
                 <FormLabel htmlFor="name" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Guest Name</FormLabel>
                 <Input name="name" type="text" value={formData.name} onChange={handleChange} isInvalid={errorName} style={{'borderRadius':'8px','border':'1px solid #C7CCD0'}} placeholder='Full Name'/>
                 {errorName && (
                     <Text color="red.500" fontSize="sm">
                     Please fill out this field
                     </Text>
                 )}
                 </>
                 :
                 <>
                 <FormLabel htmlFor="name" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Guest Family Name</FormLabel>
                 <Input name="name" type="text" value={formData.name} onChange={handleChange} isInvalid={errorName} style={{'borderRadius':'8px','border':'1px solid #C7CCD0'}} placeholder='Family Name'/>
                 {errorName && (
                     <Text color="red.500" fontSize="sm">
                     Please fill out this field
                     </Text>
                 )}
                 </>
                 
               }
           </Box>
           <Box style={{'width':'306px'}}>
             <FormLabel htmlFor="phone" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Phone</FormLabel>
             <Input name="phone" type="text" value={formData.phone}  onChange={handleChange} style={{'borderRadius':'8px','border':'1px solid #C7CCD0'}} placeholder='+52 1 56 53 28 08 94'/>
           </Box>
           <Box style={{'width':'306px'}}>
             <FormLabel htmlFor="numberOfGuests" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Number of Guests</FormLabel>
             <NumberInput name="numberOfGuests" defaultValue={0} min={0} max={15} value={formData.numberOfGuests} style={{'borderRadius':'8px','border':'1px solid #C7CCD0'}} onChange={(valueString) => setFormData({ ...formData, numberOfGuests: parseInt(valueString) })}>
               <NumberInputField />
               <NumberInputStepper>
                 <NumberIncrementStepper />
                 <NumberDecrementStepper />
               </NumberInputStepper>
             </NumberInput>
           </Box>
         </Flex>
         <Flex style={{'margin':'26.45px 0 31px 0', 'gap':'10px'}}>
             <input type="checkbox" name="family" onChange={handleChange} style={{'color':'#000000', 'borderRadius':'50%', 'border': '1px solid #B69F97', 'cursor':'pointer'}} />
             <Text style={{'color':'#000000','fontFamily':'Roboto','fontSize':'14px'}}>Check this box to indicate that this invitation is for an entire family</Text>
         </Flex>
         <Box style={{'width':'206px','marginBottom':'20px'}}>
             <FormLabel htmlFor="numberOfGuests" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Guest of:</FormLabel>
             <Select name="guestOf"   onChange={handleChange}  style={{'borderRadius':'8px','border':'1px solid #C7CCD0', 'fontFamily':'Roboto'}}>
               <option value='Both'>Both</option>
               <option value='Groom'>Groom</option>
               <option value='Bride'>Bride</option>
             </Select>
           </Box>
         <Button onClick={handleSend} backgroundColor={'#B69F97'} style={{'width':'177px','height':'48px','borderRadius':'4.8px','padding':'8px, 16px, 8px, 16px','color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px',}} _hover={{opacity:'0.5'}}>
           Save
         </Button>
       </FormControl>
     </Box>
   </Box>
   <br />
   <br />
   <br />
   <Box style={{ 'backgroundColor':'#FFFF',  width: medium ? '1110.59px' : small ? '740.59px' : '340px','borderRadius':'12px', 'margin':'auto','border':'1px solid #DEE2E8','boxShadow': '0px 2px 6px 0px #00000040'}}>
     <Heading style={{'padding':'12.43px 0 16.25px 20.13px','fontSize':'20px','lineHeight':'28px','fontWeight':'400' ,'color':'#000000','fontFamily':'Roboto'}}>Guest list</Heading>
     
     <hr />
     <Flex  style={{'width':'100%','padding': small ? '40.16px 0 0 59px' : '40.16px 0 0 15px','gap':'48px'}} flexDirection={medium ? 'row' : 'column'}>
       <Flex flexDirection={'column'} width={'150px'}>
         <Text style={{'fontSize':'14px', 'fontFamily':'Roboto','fontWeight':'400' ,'marginBottom':'7px'}} >Pending Confirmation</Text >
         <Flex style={{'margin':'auto','borderRadius':'8px', 'height':'41px' , 'backgroundColor':'#E1D6D0', 'width':'150px'}}>
           <Text style={{'fontSize':'16px','fontWeight':'500','fontFamily':'Roboto','lineHeight':'22.4px' ,'margin':'auto'}}>
             {invitations.filter(inv => inv.userId === user?.id && inv.pending).reduce((total, inv) => total + inv.numberOfGuests, 0)}
           </Text>
         </Flex >
       </Flex>
       <Flex flexDirection={'column'} width={'150px'}>
         <Text style={{'fontSize':'14px', 'fontFamily':'Roboto','fontWeight':'400' ,'marginBottom':'7px'}} >Not Attending</Text >
         <Flex style={{'margin':'auto','borderRadius':'8px', 'height':'41px' , 'backgroundColor':'#E1D6D0', 'width':'150px'}}>
           <Text style={{'fontSize':'16px','fontWeight':'500','fontFamily':'Roboto','lineHeight':'22.4px' ,'margin':'auto'}}>
             {invitations.filter(inv => inv.userId === user?.id && inv.attendance === false).reduce((total, inv) => total + inv.numberOfGuests, 0)}
           </Text>
         </Flex >
       </Flex>
       <Flex flexDirection={'column'} width={'150px'}>
         <Text style={{'fontSize':'14px', 'fontFamily':'Roboto','fontWeight':'400' ,'marginBottom':'7px'}}>Will Attend</Text >
         <Flex style={{'margin':'auto','borderRadius':'8px', 'height':'41px' , 'backgroundColor':'#E1D6D0', 'width':'150px'}}>
           <Text style={{'fontSize':'16px','fontWeight':'500','fontFamily':'Roboto','lineHeight':'22.4px' ,'margin':'auto'}}>
             { invitations.filter(inv => inv.userId === user?.id && inv.attendance === true).reduce((total, inv) => total + inv.numberOfGuests, 0)}
           </Text>
         </Flex >
       </Flex>
       <Flex flexDirection={'column'} width={'276px'}>
         <Text style={{'fontSize':'20px','fontWeight':'700','fontFamily':'Roboto','lineHeight':'28px' ,'margin':'auto', 'marginBottom':'9px'}}>
          Registered Guests : { invitations.filter(inv => inv.userId === user?.id).reduce((total, inv) => total + inv.numberOfGuests, 0)}
         </Text >
         <Button onClick={handleDownloadList} style={{'height':'48px','borderRadius':'4.8px','padding':'8px, 16px, 8px, 16px','backgroundColor':'#B69F97','color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}}>Download guest list</Button>
       </Flex>
     </Flex>
     <br />
     <hr />
     <Box style={{'width':'100%','padding': small ? '40.16px 0 0 59px' : '40.16px 0 0 0px' , 'maxHeight': small ? '430px' : '500px', 'overflowY': 'auto', 'overflowX' :'hidden'}}>
       <Heading style={{'padding':'12.43px 0 16.25px 20.13px','fontSize':'20px','lineHeight':'28px','fontWeight':'400' ,'color':'#000000','fontFamily':'Roboto'}}>Guests</Heading>
       
       <br />
       <UnorderedList w={'100%'}>
         {invitations.filter(invitation => invitation.userId === user?.id).map((invitation) => (
           <Box key={invitation.id} >
             <ListItem key={invitation.id} w='100%' display={'flex'} color={'black'} marginBottom={'50px'} flexDirection={small ? 'row' : 'column'} gap={small ? 0 : '25px'}>
               { editingId === invitation.id ?
                 <Box w={small ? '40%' : '100%'}>
                 <FormLabel htmlFor="numberOfGuests" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Name</FormLabel>
                 <Input name="name" mb={'10px'} onChange={handleUpdateChange} style={{'borderRadius':'8px','border':'1px solid #C7CCD0' , width : small ? '322px' : '300px'}} value={updateData.name}  />
                 <FormLabel htmlFor="numberOfGuests" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Phone</FormLabel>
                 <Input name="phone" mb={'10px'}  onChange={handleUpdateChange} style={{'borderRadius':'8px','border':'1px solid #C7CCD0', width : small ? '322px' : '300px'}} value={updateData.phone}  />
                 <FormLabel htmlFor="numberOfGuests" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Number of Guests</FormLabel>
                 <NumberInput name="cantidadr" defaultValue={0} min={0} max={15} value={updateData.numberOfGuests} style={{'borderRadius':'8px','border':'1px solid #C7CCD0', 'marginBlock':'15px', width : small ? '322px' : '300px'}} onChange={(valueString) => setUpdateData({ ...updateData, numberOfGuests: parseInt(valueString) })}  >
                   <NumberInputField />
                   <NumberInputStepper>
                     <NumberIncrementStepper />
                     <NumberDecrementStepper />
                   </NumberInputStepper>
                 </NumberInput>
                 <Flex gap={'15px'}>
                   <Button onClick={() => handleUpdate(invitation)} backgroundColor={'#B69F97'} style={{'color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}} _hover={{opacity:'0.5'}}>Update</Button>
                   <Button onClick={() => handleCancelSend(invitation)} backgroundColor={'#B69F97'} style={{'color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}} _hover={{opacity:'0.5'}}>Cancel</Button>
                   <Button onClick={() => handleDelete(invitation.id)} backgroundColor={'#B69F97'} style={{'color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}} _hover={{opacity:'0.5'}}>Delete</Button>
                 </Flex>
               </Box>
               :
               <Box w={small ? '40%' : '100%'}>
                 <FormLabel htmlFor="numberOfGuests" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Name</FormLabel>
                 <Text mb={'10px'} style={{'borderRadius':'8px','border':'1px solid #C7CCD0', 'padding':'7px', width : small ? '322px' : '300px'}}>{invitation.name}</Text>
                 <FormLabel htmlFor="numberOfGuests" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Phone</FormLabel>
                 <Text mb={'10px'} style={{'borderRadius':'8px','border':'1px solid #C7CCD0', 'padding':'7px', width : small ? '322px' : '300px'}}>{invitation.phone}</Text>
                 <FormLabel htmlFor="numberOfGuests" style={{'color':'#B69F97','fontSize':'14px', 'lineHeight':'16.6px', 'fontFamily':'Roboto', 'fontWeight':'400'}}>Number of Guests</FormLabel>
                 <Text mb={'10px'} style={{'borderRadius':'8px','border':'1px solid #C7CCD0', 'padding':'7px', width : small ? '322px' : '300px'}}>{invitation.numberOfGuests}</Text>
                 <Flex gap={'15px'}>
                   <Button  onClick={() => writeClipboardText(`http://localhost:5174/confirmacion/${invitation.id}`)} backgroundColor={'#B69F97'} style={{'color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}} _hover={{opacity:'0.5'}}> {medium ? 'Copy link' : 'Copy'}</Button>
                   <Button onClick={() => handleEdit(invitation)} backgroundColor={'#B69F97'} style={{'color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}} _hover={{opacity:'0.5'}}>Edit</Button>
                   <Button onClick={() => handleDelete(invitation.id)}  backgroundColor={'#B69F97'} style={{'color':'#FFFFFF','fontWeight':'300','fontFamily':'Roboto','fontSize':'20px','lineHeight':'30px'}} _hover={{opacity:'0.5'}}>Delete</Button>
                 </Flex>
               </Box>
               }
               <Flex  style={{'width':'60%', 'justifyContent':'center'} }>
                 <Flex flexDirection={'column'} width={'150px'}>
                   <Text style={{'fontSize':'14px', 'fontFamily':'Roboto','fontWeight':'400' ,'marginBottom':'7px','margin':'auto'}} >Status</Text >
                   <Flex style={{'margin':'auto','borderRadius':'8px', 'height':'41px' , 'backgroundColor':'#E1D6D0', 'width':'150px'}}>
                     <Text style={{'fontSize':'16px','fontWeight':'500','fontFamily':'Roboto','lineHeight':'22.4px' ,'margin':'auto'}}>
                       {invitation.pending ? 'Pending' : invitation.attendance ? 'Will Attend' : 'Not Attending'}
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
