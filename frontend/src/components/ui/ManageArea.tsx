import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { JSX } from 'react';

export default function ManageArea({ Form, Table }: { Form: JSX.Element; Table: JSX.Element }) {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexGrow: 0,
          flexShrink: 1,
          height: '100%',
          bgcolor: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.primary.contrastText,
        }}
      >
        {Form}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          flexShrink: 1,
          height: '100%',
          bgcolor: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[900],
        }}
      >
        {Table}
      </Box>
    </Box>
  );
}
