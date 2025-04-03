import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { Checkbox, FormControlLabel } from '@mui/material';
import { createTcfSchema } from '../../../../packages/validators/zod-schemas/create/create-tcf.validator'
import { updateTcfSchema } from '../../../../packages/validators/zod-schemas/update/update-tcf.validator'

type CreateTcfFormData = z.infer<typeof createTcfSchema>;

type UpdateTcfFormData = {
  name?: string;
  status?: boolean;
};

export function CreateTcfForm() {
  const theme = useTheme();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTcfFormData>({
    resolver: zodResolver(createTcfSchema),
  });

  const onSubmit = (data: CreateTcfFormData) => {
    console.log(data);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    }}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: 4,
        maxWidth: 400,
        borderRadius: 5,
        boxShadow: theme.shadows[24],
        bgcolor:
          theme.palette.mode === 'light'
            ? theme.palette.common.white
            : theme.palette.common.black,
      }}
    >
      <h1>Novo TCF</h1>

      {submitted && (
        <Alert severity="success" style={{ width: '100%' }}>
          Formulário enviado com sucesso!
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nome"
            {...register('name')}
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <Button type="submit" variant="contained" color="primary">
            Enviar
          </Button>
        </Box>
      </form>
    </Box>
    </Box>
  );
}




export function UpdateTcfForm({ initialData }: { initialData?: UpdateTcfFormData }) {
  const theme = useTheme();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTcfFormData>({
    resolver: zodResolver(updateTcfSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: UpdateTcfFormData) => {
    console.log('Dados para atualização:', data);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
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
        bgcolor:
          theme.palette.mode === 'light'
            ? theme.palette.common.white
            : theme.palette.common.black,
      }}
    >
      <h1>Atualizar TCF</h1>

      {submitted && (
        <Alert severity="success" style={{ width: '100%' }}>
          Atualização realizada com sucesso!
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nome"
            {...register('name')}
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <FormControlLabel
            control={<Checkbox {...register('status')} />}
            label="Status"
          />

          <Button type="submit" variant="contained" color="primary">
            Atualizar
          </Button>
        </Box>
      </form>
    </Box>
  );
}

