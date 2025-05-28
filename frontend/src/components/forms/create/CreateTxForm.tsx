import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { JSX, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import ErrorAlert from '@/components/alerts/ErrorAlert';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { useGetAllCat } from '@/hooks/service/cat/useGetAllCat';
import { useGetAllCf } from '@/hooks/service/cf/useGetAllCf';
import { useGetAllCp } from '@/hooks/service/cp/useGetAllCp';
import { useGetAllCr } from '@/hooks/service/cr/useGetAllCr';
import { usePostTx } from '@/hooks/service/tx/usePostTx';
import { useAuth } from '@/hooks/useAuth';
import { useFormStore } from '@/hooks/useFormStore';
import { createTxSchema, strToPtBrMoney } from '@monorepo/packages';

type CreateTxFormData = z.infer<typeof createTxSchema>;
type RadioInput = 'cp' | 'cr';

export function CreateTxForm(): JSX.Element | null | string {
  const mutation = usePostTx();
  const { forms } = useFormStore();
  const { isPending: isPendingCf, error: errorCf, data: cfData } = useGetAllCf();
  const { isPending: isPendingCat, error: errorCat, data: catData } = useGetAllCat();
  const { isPending: isPendingCp, error: errorCp, data: cpData } = useGetAllCp();
  const { isPending: isPendingCr, error: errorCr, data: crData } = useGetAllCr();
  const [account, setAccount] = useState<RadioInput>('cp');

  const { session } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateTxFormData>({
    resolver: zodResolver(createTxSchema),
    mode: 'onSubmit',
    defaultValues: {
      value: '',
      cf: '',
      description: '',
      category: '',
      obs: '',
      tdate: '',
      cp: undefined,
      cr: undefined,
      user: session ? session.user.id : '',
    },
  });

  const onSubmit = async (data: CreateTxFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset({});
    } catch (err) {
      console.error('Erro ao criar Transação:', err);
    }
  };

  if (forms.tx.type === 'update') return null;

  if (errorCf || errorCat || errorCp || errorCr) {
    const errorMessage = errorCf?.message || errorCat?.message || errorCp?.message || errorCr?.message;
    return <ErrorAlert message={errorMessage ? errorMessage : 'Ocorreu um erro!'} />;
  }

  return (
    <FormContainer formName="tx">
      <Typography variant="h4">Nova Transação</Typography>

      {mutation.isSuccess && (
        <Alert severity="success" style={{ width: '100%' }}>
          Transação criada com sucesso!
        </Alert>
      )}

      {mutation.isError && (
        <Alert severity="error" style={{ width: '100%' }}>
          Ocorreu um erro ao criar a Transação. Tente novamente.
        </Alert>
      )}

      {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      {(isPendingCf || isPendingCat || isPendingCp || isPendingCr) && <CustomBackdrop isOpen={true} />}

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
                  variant="outlined"
                  size="small"
                  sx={{ width: '100%' }}
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
              label="Data da Transação"
              {...register('tdate')}
              sx={{ width: '100%' }}
              variant="outlined"
              size="small"
              error={!!errors.tdate}
              helperText={errors.tdate?.message}
              type="date"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Box>

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Autocomplete
                sx={{ flex: 1, width: '100%' }}
                options={catData ? catData : []}
                getOptionLabel={(option) => option.name || ''}
                onChange={(_, data) => field.onChange(data ? data.id : '')}
                value={field.value ? catData?.find((option) => option.id === field.value) || null : null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categoria"
                    size="small"
                    variant="outlined"
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  />
                )}
              />
            )}
          />

          <Controller
            name="cf"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={cfData ? cfData : []}
                getOptionLabel={(option) => (option.number ? `${option.number} | ${option.ag} | ${option.bank}` : '')}
                onChange={(_, data) => field.onChange(data ? data.id : '')}
                value={field.value ? cfData?.find((option) => option.id === field.value) || null : null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="N. | Ag | Banco - Conta Financeira"
                    variant="outlined"
                    size="small"
                    error={!!errors.cf}
                    helperText={errors.cf?.message}
                  />
                )}
              />
            )}
          />

          <FormControl>
            <FormLabel id="radio-buttons-group-label">Conta a</FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              defaultValue={account}
              name="radio-buttons-group"
              onChange={(e) => setAccount(e.target.value as RadioInput)}
              sx={{ display: 'flex', flexDirection: 'row', marginBottom: -2 }}
            >
              <FormControlLabel value="cp" control={<Radio />} label="pagar" />
              <FormControlLabel value="cr" control={<Radio />} label="receber" />
            </RadioGroup>
          </FormControl>

          {account === 'cp' ? (
            <Controller
              name="cp"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  sx={{ flex: 1, width: '100%' }}
                  options={cpData ? cpData : []}
                  getOptionLabel={(option) =>
                    option.id
                      ? `${option.supplier.name} | ${new Date(option.due + 'T00:00:00').toLocaleDateString()} | R$ ${strToPtBrMoney(String(option.value))}`
                      : ''
                  }
                  onChange={(_, data) => field.onChange(data ? data.id : '')}
                  value={field.value ? cpData?.find((option) => option.id === field.value) || null : null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Fornecedor | Vcto. | Valor - Conta a pagar"
                      size="small"
                      variant="outlined"
                      error={!!errors.cp}
                      helperText={errors.cp?.message}
                    />
                  )}
                />
              )}
            />
          ) : (
            <Controller
              name="cr"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={crData ? crData : []}
                  getOptionLabel={(option) =>
                    option.id
                      ? `${option.customer.name} | ${new Date(option.due + 'T00:00:00').toLocaleDateString()} | R$ ${strToPtBrMoney(String(option.value))}`
                      : ''
                  }
                  onChange={(_, data) => field.onChange(data ? data.id : '')}
                  value={field.value ? crData?.find((option) => option.id === field.value) || null : null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cliente | Vcto. | Valor - Conta a receber"
                      variant="outlined"
                      size="small"
                      error={!!errors.cr}
                      helperText={errors.cr?.message}
                    />
                  )}
                />
              )}
            />
          )}

          <TextField
            label="Descrição"
            {...register('description')}
            variant="outlined"
            size="small"
            error={!!errors.description}
            helperText={errors.description?.message}
          />

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
            {mutation.isPending ? 'Enviando...' : 'Criar Transação'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
