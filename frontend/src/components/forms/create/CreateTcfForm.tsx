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
import { usePostTcf } from '@/hooks/service/tcf/usePostTcf';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { createTcfSchema } = packages;

type CreateTcfFormData = z.infer<typeof createTcfSchema>;

export function CreateTcfForm(): JSX.Element | null {
  const mutation = usePostTcf();
  const { forms } = useFormStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTcfFormData>({
    resolver: zodResolver(createTcfSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: CreateTcfFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset();
    } catch (err) {
      console.error('Erro ao enviar o formulário:', err);
    }
  };
  if (forms.tcf.type === 'update') {
    return null;
  }

  return (
    <FormContainer formName="tcf">
      <Typography variant="h4">Novo Tipo de conta Financeira</Typography>
      {mutation.isSuccess && (
        <ToastAlert severity="success" title="Sucesso" message="Tipo criado com sucesso!" open icon={<DoneIcon />} />
      )}

      {mutation.isError && <ToastAlert severity="error" title="Erro" message={'Erro ao criar tipo.'} open />}

      {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', minWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <TextField
            label="Nome"
            {...register('name')}
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message}
            size="small"
          />
          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Enviando...' : 'Enviar'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
