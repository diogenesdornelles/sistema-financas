// Nav.jsx (exemplo de botão toggle)
import { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../context/color-mode-context';


function ToggleThemeButton() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);


  return (
    <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{marginRight: 8}}>
      {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

export default ToggleThemeButton;