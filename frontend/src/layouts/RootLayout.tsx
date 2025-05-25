import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Footer from '@/templates/footer';
import Nav from '@/templates/nav';

function RootLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Garante que o layout ocupe toda a altura da viewport
        minWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      <Nav />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}

export default RootLayout;
