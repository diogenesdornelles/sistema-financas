import { zodResolver } from '@hookform/resolvers/zod';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DoneIcon from '@mui/icons-material/Done';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePostTcp } from '@/hooks/service/tcp/usePostTcp';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { createTcpSchema } = packages;

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
        <ToastAlert
          severity="success"
          title="Sucesso"
          message="Tipo criado com sucesso!"
          open
          icon={<DoneIcon />}
        />
      )}

      {mutation.isError && <ToastAlert severity="error" title="Erro" message={'Erro ao criar tipo.'} open />}

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
