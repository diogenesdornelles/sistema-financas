import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import { JSX } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import ErrorAlert from '@/components/alerts/ErrorAlert';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePostCr } from '@/hooks/service/cr/usePostCr';
import { useGetAllPartner } from '@/hooks/service/partner/useGetAllPartner';
import { useGetAllTcr } from '@/hooks/service/tcr/useGetAllTcr';
import { useAuth } from '@/hooks/useAuth';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
const { createCrSchema, strToPtBrMoney } = packages;

type CreateCrFormData = z.infer<typeof createCrSchema>;

export function CreateCrForm(): JSX.Element | null {
  const mutation = usePostCr();
  const { forms } = useFormStore();
  const { isPending: isPendingTcr, error: errorTcr, data: tcrData } = useGetAllTcr();
  const { isPending: isPendingPartner, error: errorPartner, data: partnerData } = useGetAllPartner();
  const { session } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateCrFormData>({
    resolver: zodResolver(createCrSchema),
    mode: 'onSubmit',
    defaultValues: {
      value: '0,00',
      type: '',
      customer: '',
      due: '',
      obs: '',
      user: session ? session.user.id : '',
    },
  });

  const onSubmit = async (data: CreateCrFormData) => {
    try {
      await mutation.mutateAsync({
        ...data,
      });
      reset();
    } catch (err) {
      console.error('Erro ao criar Conta:', err);
    }
  };

  if (forms.cr.type === 'update') return null;

  if (errorTcr || errorPartner) {
    const errorMessage = errorTcr?.message || errorPartner?.message;
    return <ErrorAlert message={errorMessage ? errorMessage : 'Ocorreu um erro!'} />;
  }

  return (
    <FormContainer formName="cr">
      <Typography variant="h4">Nova Conta a Receber</Typography>

      {mutation.isSuccess && (
        <Alert severity="success" style={{ width: '100%' }}>
          Conta criada com sucesso!
        </Alert>
      )}

      {mutation.isError && (
        <Alert severity="error" style={{ width: '100%' }}>
          Ocorreu um erro ao criar a Conta. Tente novamente.
        </Alert>
      )}

      {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      {(isPendingTcr || isPendingPartner) && <CustomBackdrop isOpen={mutation.isPending} />}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', minWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', columnGap: 2 }}>
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Valor (R$)"
                  sx={{ width: '100%' }}
                  variant="outlined"
                  size="small"
                  error={!!errors.value}
                  helperText={errors.value?.message}
                  onChange={(e) => {
                    const formatted = strToPtBrMoney(e.target.value);
                    field.onChange(formatted);
                  }}
                />
              )}
            />
            <TextField
              label="Vencimento"
              {...register('due')}
              variant="outlined"
              error={!!errors.due}
              size="small"
              sx={{ width: '100%' }}
              helperText={errors.due?.message}
              type="date"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', columnGap: 2 }}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={tcrData ? tcrData : []}
                  sx={{ flex: 1, width: '100%' }}
                  getOptionLabel={(option) => option.name || ''}
                  onChange={(_, data) => field.onChange(data ? data.id : '')}
                  value={field.value ? tcrData?.find((option) => option.id === field.value) || null : null}
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
          </Box>

          <Controller
            name="customer"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={partnerData ? partnerData : []}
                getOptionLabel={(option) => option.name || ''}
                onChange={(_, data) => field.onChange(data ? data.id : '')}
                value={field.value ? partnerData?.find((option) => option.id === field.value) || null : null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Cliente"
                    variant="outlined"
                    error={!!errors.customer}
                    helperText={errors.customer?.message}
                  />
                )}
              />
            )}
          />

          <TextField
            label="Observações"
            size="small"
            {...register('obs')}
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
