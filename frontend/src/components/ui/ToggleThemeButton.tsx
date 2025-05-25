// Nav.jsx (exemplo de botão toggle)
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';

import { ColorModeContext } from '@/contexts/ColorModeContext';

function ToggleThemeButton() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ marginRight: 8 }}>
      {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

export default ToggleThemeButton;
