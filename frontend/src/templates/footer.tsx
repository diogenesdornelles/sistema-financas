import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Footer() {
    return (

        <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 2, mt: 'auto', textAlign: 'center' }}>
            <Typography variant="body2">© 2025 Meu Sistema</Typography>
        </Box>

    );
}

export default Footer;