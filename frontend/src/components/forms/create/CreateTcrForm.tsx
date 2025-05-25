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
import { usePostTcr } from '@/hooks/service/tcr/usePostTcr';
import { useFormStore } from '@/hooks/useFormStore';
import { createTcrSchema } from '@packages/validators/zod-schemas/create/create-tcr.validator';

type CreateTcrFormData = z.infer<typeof createTcrSchema>;

export function CreateTcrForm(): JSX.Element | null {
  const mutation = usePostTcr();
  const { forms } = useFormStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTcrFormData>({
    resolver: zodResolver(createTcrSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: CreateTcrFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset();
    } catch (err) {
      console.error('Erro ao criar Tipo de conta a receber:', err);
    }
  };

  // Exibe o formulário de criação somente se o modo for 'create'
  if (forms.tcr.type === 'update') return null;

  return (
    <FormContainer formName="tcr">
      <Typography variant="h4">Novo Tipo de conta a receber</Typography>

      {mutation.isSuccess && (
        <Alert severity="success" style={{ width: '100%' }}>
          Tipo de conta a receber criado com sucesso!
        </Alert>
      )}

      {mutation.isError && (
        <Alert severity="error" style={{ width: '100%' }}>
          Ocorreu um erro ao criar o Tipo de conta a receber. Tente novamente.
        </Alert>
      )}

      {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', minWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Nome"
            {...register('name')}
            size="small"
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Enviando...' : 'Criar Tipo'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
