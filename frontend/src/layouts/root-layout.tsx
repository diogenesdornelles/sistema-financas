import { Outlet } from 'react-router-dom';
import Nav from '../templates/nav';
import Footer from '../templates/footer';
import { Box } from '@mui/material';

function RootLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: '100vw', overflow: 'hidden' }}>
      <Nav/>
      <Outlet />
      <Footer/>
    </Box>
  );
}

export default RootLayout;