import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, FormControlLabel } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ButtonUpdateForm from '@/components/ui/ButtonUpdateForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePutTcf } from '@/hooks/service/tcf/usePutTcf';
import { useFormStore } from '@/hooks/useFormStore';
import { updateTcfSchema } from '@packages/validators/zodSchemas/update/updateTcfValidator';

type UpdateTcfFormData = z.infer<typeof updateTcfSchema>;

export function UpdateTcfForm(): JSX.Element | null {
  const { forms } = useFormStore();

  const mutation = usePutTcf(forms.tcf.updateItem ? forms.tcf.updateItem.id : '');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateTcfFormData>({
    resolver: zodResolver(updateTcfSchema),
    defaultValues: forms.tcf.updateItem
      ? {
          name: forms.tcf.updateItem.name,
          status: forms.tcf.updateItem.status ? forms.tcf.updateItem.status : undefined,
        }
      : {},
  });

  const statusValue = watch('status');

  const handleFormSubmit = async (data: UpdateTcfFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset({
        name: data.name,
        status: data.status ? data.status : undefined,
      });
    } catch (err) {
      console.error('Erro ao atualizar o formulário:', err);
    }
  };
  if (forms.tcf.type === 'create' || !forms.tcf.updateItem) {
    return null;
  }

  return (
    <FormContainer formName="tcf">
      <ButtonUpdateForm title="Atualizar Tipo de conta financeira" name="tcf" />

      {mutation.isSuccess && (
        <Alert severity="success" style={{ width: '100%' }}>
          Atualização realizada com sucesso!
        </Alert>
      )}

      {mutation.isError && (
        <Alert severity="error" style={{ width: '100%' }}>
          Ocorreu um erro ao atualizar o formulário. Tente novamente.
        </Alert>
      )}

      {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      <form onSubmit={handleSubmit(handleFormSubmit)} style={{ width: '100%', minWidth: 500 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nome"
            {...register('name')}
            variant="outlined"
            size="small"
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <FormControlLabel
            control={<Checkbox size="small" checked={statusValue} {...register('status')} />}
            label={`Status: ${statusValue ? 'Ativo' : 'Inativo'}`}
          />

          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
