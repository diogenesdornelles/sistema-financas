import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, TextField, Typography } from '@mui/material';
import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DoneIcon from '@mui/icons-material/Done';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePostCat } from '@/hooks/service/cat/usePostCat';
import { useAuth } from '@/hooks/useAuth';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { createCatSchema } = packages;

type CreateCatFormData = z.infer<typeof createCatSchema>;

export function CreateCatForm(): JSX.Element | null {
  const mutation = usePostCat();
  const { forms } = useFormStore();
  const { session } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCatFormData>({
    resolver: zodResolver(createCatSchema),
    defaultValues: {
      name: '',
      obs: '',
      description: '',
      user: session ? session?.user.id : '',
    },
  });

  const onSubmit = async (data: CreateCatFormData) => {
    try {
      await mutation.mutateAsync({ ...data });
      reset();
    } catch (err) {
      console.error('Erro ao criar categoria:', err);
    }
  };

  if (forms.cat.type === 'update') return null;

  return (
    <FormContainer formName="cat">
      <Typography variant="h4">Nova Categoria</Typography>

      {mutation.isSuccess && (
        <ToastAlert
          severity="success"
          title="Sucesso"
          message="Categoria criada com sucesso!"
          open
          icon={<DoneIcon />}
        />
      )}
      {mutation.isError && <ToastAlert severity="error" title="Erro" message={'Erro ao criar categoria.'} open />}
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

          <TextField
            label="Descrição"
            {...register('description')}
            variant="outlined"
            error={!!errors.description}
            helperText={errors.description?.message}
            multiline
            rows={3}
            size="small"
          />

          <TextField
            label="Observações"
            {...register('obs')}
            variant="outlined"
            error={!!errors.obs}
            helperText={errors.obs?.message}
            multiline
            rows={3}
            size="small"
          />
          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Enviando...' : 'Criar Categoria'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
