// ThemeContext.jsx
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { ColorModeContext } from '@/contexts/ColorModeContext';

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  // Carrega o modo inicial do localStorage, padrão é 'light'
  const [mode, setMode] = useState<'light' | 'dark'>(
    (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light',
  );

  // Atualiza o localStorage ao mudar o modo
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => {
    // Cria o tema incrementalmente, preservando o padrão
    return createTheme({
      palette: {
        mode,
      },
    });
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
