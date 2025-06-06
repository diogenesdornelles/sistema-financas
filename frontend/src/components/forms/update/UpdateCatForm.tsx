import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DoneIcon from '@mui/icons-material/Done';
import ButtonUpdateForm from '@/components/ui/ButtonUpdateForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePutCat } from '@/hooks/service/cat/usePutCat';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { updateCatSchema } = packages;

type UpdateCatFormData = z.infer<typeof updateCatSchema>;

export function UpdateCatForm(): JSX.Element | null {
  const { forms } = useFormStore();
  const mutation = usePutCat(forms.cat.updateItem ? forms.cat.updateItem.id : '');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateCatFormData>({
    resolver: zodResolver(updateCatSchema),
    defaultValues: forms.cat.updateItem
      ? {
          name: forms.cat.updateItem.name,
          obs: forms.cat.updateItem.obs,
          description: forms.cat.updateItem.description,
          status: forms.cat.updateItem.status,
        }
      : {},
  });

  const statusValue = watch('status');

  const onSubmit = async (data: UpdateCatFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset({
        name: data.name,
        obs: data.obs,
        description: data.description,
        status: data.status,
      });
    } catch (err) {
      console.error('Erro ao atualizar Categoria:', err);
    }
  };

  if (forms.cat.type === 'create' || !forms.cat.updateItem) return null;

  return (
    <FormContainer formName="cat">
      <ButtonUpdateForm name="cat" title="Atualizar categoria" />

      {mutation.isSuccess && (
        <ToastAlert
          severity="success"
          title="Sucesso"
          message="Categoria alterada com sucesso!"
          open
          icon={<DoneIcon />}
        />
      )}

      {mutation.isError && <ToastAlert severity="error" title="Erro" message={'Erro ao alterar categoria.'} open />}

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
            size="small"
            rows={3}
          />

          <TextField
            label="Observações"
            {...register('obs')}
            variant="outlined"
            error={!!errors.obs}
            helperText={errors.obs?.message}
            multiline
            size="small"
            rows={3}
          />

          <FormControlLabel
            control={<Checkbox size="small" checked={statusValue} {...register('status')} />}
            label={`Status: ${statusValue ? 'Ativo' : 'Inativo'}`}
          />
          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Atualizando...' : 'Atualizar Categoria'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
