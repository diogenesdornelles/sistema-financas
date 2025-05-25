import { zodResolver } from '@hookform/resolvers/zod';
import { Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePostTcp } from '@/hooks/service/tcp/usePostTcp';
import { useFormStore } from '@/hooks/useFormStore';
import { createTcpSchema } from '@packages/validators/zod-schemas/create/create-tcp.validator';

type CreateTcpFormData = z.infer<typeof createTcpSchema>;

export function CreateTcpForm(): JSX.Element | null {
  const mutation = usePostTcp();
  const { forms } = useFormStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTcpFormData>({
    resolver: zodResolver(createTcpSchema),
    defaultValues: {
      name: '',
    },
  });

  // Exibe o formulário de criação somente se o modo não for 'update'
  if (forms.tcp.type === 'update') return null;

  const onSubmit = async (data: CreateTcpFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset();
    } catch (err) {
      console.error('Erro ao criar Tipo de conta:', err);
    }
  };

  return (
    <FormContainer formName="tcp">
      <Typography variant="h4">Novo Tipo de conta a pagar</Typography>
      {mutation.isSuccess && (
        <Alert severity="success" style={{ width: '100%' }}>
          Tipo de conta a paga criado com sucesso!
        </Alert>
      )}

      {mutation.isError && (
        <Alert severity="error" style={{ width: '100%' }}>
          Ocorreu um erro ao criar o Tipo de conta a paga. Tente novamente.
        </Alert>
      )}

      {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', minWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Nome"
            {...register('name')}
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message}
            size="small"
          />
          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Enviando...' : 'Criar Tipo'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
