import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Nav from '../templates/nav';
import Footer from '../templates/footer';

function RootLayout() {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: '100vw' }}>
      <Nav/>
      <Container sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Outlet />
      </Container>
      <Footer/>
    </Box>
  );
}

export default RootLayout;