import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useAuth } from '@/hooks/useAuth';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { createTokenSchema } = packages;

type LoginFormData = z.infer<typeof createTokenSchema>;

function Login() {
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(createTokenSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const success = await logIn(data.cpf, data.pwd);

    if (success) {
      navigate('/home');
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          padding: 4,
          maxWidth: 400,
          borderRadius: 5,
          boxShadow: theme.shadows[24],
          bgcolor: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.common.black,
        }}
      >
        <h1>Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          {error && <ToastAlert severity="error" title="Erro" message={'Usuário ou senha errados.'} open />}
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="CPF"
              {...register('cpf')}
              variant="outlined"
              error={!!errors.cpf}
              helperText={errors.cpf?.message}
            />
            <TextField
              label="Senha"
              type="password"
              {...register('pwd')}
              variant="outlined"
              error={!!errors.pwd}
              helperText={errors.pwd?.message?.split('\n').map((line, index) => <div key={index}>{line}</div>)}
            />
            <Button type="submit" variant="contained" color="primary">
              Entrar
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default Login;
