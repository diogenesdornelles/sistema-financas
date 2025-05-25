import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

function Footer() {
  const theme = useTheme();
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.mode === 'light' ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.87)',
        py: 2,
        mt: 'auto',
        textAlign: 'center',
      }}
    >
      <Typography sx={{ color: 'white' }} variant="body2">
        © 2025 SysFINAN
      </Typography>
    </Box>
  );
}

export default Footer;
