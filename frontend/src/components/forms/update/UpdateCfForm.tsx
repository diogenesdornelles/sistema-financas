import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Autocomplete, Box, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { JSX } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import ButtonUpdateForm from '@/components/ui/ButtonUpdateForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePutCf } from '@/hooks/service/cf/usePutCf';
import { useGetAllTcf } from '@/hooks/service/tcf/useGetAllTcf';
import { useFormStore } from '@/hooks/useFormStore';
import { updateCfSchema } from '@packages/validators/zodSchemas/update/updateCfValidator';

type UpdateCfFormData = z.infer<typeof updateCfSchema>;

export function UpdateCfForm(): JSX.Element | null {
  const { forms } = useFormStore();
  const mutation = usePutCf(forms.cf.updateItem ? forms.cf.updateItem.id : '');
  const { isPending, error, data } = useGetAllTcf();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateCfFormData>({
    resolver: zodResolver(updateCfSchema),
    defaultValues: forms.cf.updateItem
      ? {
          number: forms.cf.updateItem.number,
          type: forms.cf.updateItem.type,
          ag: forms.cf.updateItem.ag || undefined,
          bank: forms.cf.updateItem.bank || undefined,
          obs: forms.cf.updateItem.obs || undefined,
          status: forms.cf.updateItem.status,
        }
      : {},
  });

  const statusValue = watch('status');

  const onSubmit = async (data: UpdateCfFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset({
        number: data.number,
        type: data.type,
        ag: data.ag || undefined,
        bank: data.bank || undefined,
        obs: data.obs || undefined,
        status: data.status,
      });
    } catch (err) {
      console.error('Erro ao atualizar Conta:', err);
    }
  };

  // Exibe apenas se o formStore estiver em modo update e houver item para atualizar
  if (forms.cf.type === 'create' || !forms.cf.updateItem) return null;

  if (error)
    return (
      <Alert severity="error" style={{ width: '100%' }}>
        {`'Ocorreu um erro: ' + ${error.message}`}
      </Alert>
    );

  return (
    <FormContainer formName="cf">
      <ButtonUpdateForm name="cf" title="Atualizar Conta Financeira" />

      {isPending && <CustomBackdrop isOpen={true} />}

      {mutation.isSuccess && (
        <Alert severity="success" style={{ width: '100%' }}>
          Conta atualizado com sucesso!
        </Alert>
      )}

      {mutation.isError && (
        <Alert severity="error" style={{ width: '100%' }}>
          Ocorreu um erro ao atualizar o Conta. Tente novamente.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', minWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <TextField
              label="Número"
              {...register('number')}
              variant="outlined"
              error={!!errors.number}
              helperText={errors.number?.message}
              sx={{ width: '100%' }}
              size="small"
            />
          </Box>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={data ? data : []}
                getOptionLabel={(option) => option.name || ''}
                onChange={(_, data) => field.onChange(data ? data.id : '')}
                defaultValue={(data && data.find((option) => option.id === forms.cf.updateItem?.type)) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipo"
                    variant="outlined"
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    size="small"
                  />
                )}
              />
            )}
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <TextField
              label="Agência"
              {...register('ag')}
              variant="outlined"
              error={!!errors.ag}
              helperText={errors.ag?.message}
              size="small"
            />

            <TextField
              label="Banco"
              {...register('bank')}
              variant="outlined"
              error={!!errors.bank}
              helperText={errors.bank?.message}
              size="small"
            />
          </Box>

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

          <FormControlLabel
            control={<Checkbox size="small" checked={statusValue} {...register('status')} />}
            label={`Status: ${statusValue ? 'Ativo' : 'Inativo'}`}
          />

          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Atualizando...' : 'Atualizar Conta'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
