import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import { JSX } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import ErrorAlert from '@/components/alerts/ErrorAlert';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePostCf } from '@/hooks/service/cf/usePostCf';
import { useGetAllTcf } from '@/hooks/service/tcf/useGetAllTcf';
import { useAuth } from '@/hooks/useAuth';
import { useFormStore } from '@/hooks/useFormStore';
import { strToPtBrMoney } from '@/utils/strToPtBrMoney';
import { createCfSchema } from '@packages/validators/zodSchemas/create/createCfValidator';

type CreateCfFormData = z.infer<typeof createCfSchema>;

export function CreateCfForm(): JSX.Element | null {
  const mutation = usePostCf();
  const { forms } = useFormStore();
  const { isPending, error, data } = useGetAllTcf();
  const { session } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateCfFormData>({
    resolver: zodResolver(createCfSchema),
    mode: 'onSubmit',
    defaultValues: {
      number: '',
      balance: '',
      user: session ? session?.user.id : '',
      bank: '',
      ag: '',
      type: '',
      obs: '',
    },
  });

  const onSubmit = async (data: CreateCfFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset();
    } catch (err) {
      console.error('Erro ao criar Conta:', err);
    }
  };

  if (forms.cf.type === 'update') return null;

  if (error) return <ErrorAlert message={error.message} />;

  return (
    <FormContainer formName="cf">
      <Typography variant="h4">Nova Conta Financeira</Typography>

      {isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      {mutation.isSuccess && (
        <Alert severity="success" style={{ width: '100%' }}>
          Conta criada com sucesso!
        </Alert>
      )}

      {mutation.isError && (
        <Alert severity="error" style={{ width: '100%' }}>
          Ocorreu um erro ao criar o Conta. Tente novamente.
        </Alert>
      )}

      {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', minWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <TextField
              label="Número"
              {...register('number')}
              variant="outlined"
              error={!!errors.number}
              helperText={errors.number?.message}
              size="small"
              sx={{ width: '100%' }}
            />
            <Controller
              name="balance"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  // type="number"
                  label="Saldo(R$)"
                  size="small"
                  variant="outlined"
                  sx={{ width: '100%' }}
                  error={!!errors.balance}
                  helperText={errors.balance?.message}
                  onChange={(e) => {
                    const formatedValue = strToPtBrMoney(e.target.value);
                    field.onChange(formatedValue);
                  }}
                />
              )}
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
                value={field.value ? data?.find((option) => option.id === field.value) || null : null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipo"
                    variant="outlined"
                    size="small"
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  />
                )}
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <TextField
              label="Agência"
              size="small"
              {...register('ag')}
              variant="outlined"
              error={!!errors.ag}
              helperText={errors.ag?.message}
            />

            <TextField
              label="Banco"
              size="small"
              {...register('bank')}
              variant="outlined"
              error={!!errors.bank}
              helperText={errors.bank?.message}
            />
          </Box>

          <TextField
            label="Observações"
            {...register('obs')}
            size="small"
            variant="outlined"
            error={!!errors.obs}
            helperText={errors.obs?.message}
            multiline
            rows={3}
          />

          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Enviando...' : 'Criar Conta'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
