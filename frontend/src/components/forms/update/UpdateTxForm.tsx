import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { JSX, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import ErrorAlert from '@/components/alerts/ErrorAlert';
import ButtonUpdateForm from '@/components/ui/ButtonUpdateForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { useGetAllCat } from '@/hooks/service/cat/useGetAllCat';
import { useGetAllCf } from '@/hooks/service/cf/useGetAllCf';
import { useGetAllCp } from '@/hooks/service/cp/useGetAllCp';
import { useGetAllCr } from '@/hooks/service/cr/useGetAllCr';
import { usePutTx } from '@/hooks/service/tx/usePutTx';
import { useFormStore } from '@/hooks/useFormStore';
import { strToPtBrMoney } from '@/utils/strToPtBrMoney';
import { updateTxSchema } from '@packages/validators/zod-schemas/update/update-tx.validator';

type UpdateTxFormData = z.infer<typeof updateTxSchema>;
type RadioInput = 'cp' | 'cr';

export function UpdateTxForm(): JSX.Element | null | string {
  const { forms } = useFormStore();
  const mutation = usePutTx(forms.tx.updateItem ? forms.tx.updateItem.id : '');
  const { isPending: isPendingCf, error: errorCf, data: cfData } = useGetAllCf();
  const { isPending: isPendingCat, error: errorCat, data: catData } = useGetAllCat();
  const { isPending: isPendingCp, error: errorCp, data: cpData } = useGetAllCp();
  const { isPending: isPendingCr, error: errorCr, data: crData } = useGetAllCr();
  const [account, setAccount] = useState<RadioInput>('cp');

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<UpdateTxFormData>({
    resolver: zodResolver(updateTxSchema),
    defaultValues: forms.tx.updateItem
      ? {
          value: strToPtBrMoney(forms.tx.updateItem?.value || ''),
          cf: forms.tx.updateItem.cf ? forms.tx.updateItem.cf : undefined,
          cp: forms.tx.updateItem.cp ? forms.tx.updateItem.cp : undefined,
          cr: forms.tx.updateItem.cr ? forms.tx.updateItem.cr : undefined,
          description: forms.tx.updateItem.description ? forms.tx.updateItem.description : '',
          category: forms.tx.updateItem.category ? forms.tx.updateItem.category : undefined,
          obs: forms.tx.updateItem.obs ? forms.tx.updateItem.obs : undefined,
          status: forms.tx.updateItem.status,
          tdate: forms.tx.updateItem.tdate ? String(forms.tx.updateItem.tdate) : '',
        }
      : {},
  });

  const statusValue = watch('status');

  const onSubmit = async (data: UpdateTxFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset({
        value: strToPtBrMoney(data.value || ''),
        cf: data.cf ? data.cf : undefined,
        cp: data.cp ? data.cp : undefined,
        cr: data.cr ? data.cr : undefined,
        description: data.description ? data.description : '',
        category: data.category ? data.category : undefined,
        obs: data.obs ? data.obs : undefined,
        status: data.status,
        tdate: data.tdate ? String(data.tdate) : '',
      });
    } catch (err) {
      console.error('Erro ao atualizar Transação:', err);
    }
  };

  if (forms.tx.type === 'create' || !forms.tx.updateItem) return null;

  if (errorCf || errorCat || errorCp || errorCr) {
    const errorMessage = errorCf?.message || errorCat?.message || errorCp?.message || errorCr?.message;
    return <ErrorAlert message={errorMessage ? errorMessage : 'Ocorreu um erro!'} />;
  }

  return (
    <FormContainer formName="tx">
      <ButtonUpdateForm name="tx" title="Atualizar Transação" />
      {mutation.isSuccess && (
        <Alert severity="success" style={{ width: '100%' }}>
          Transação atualizada com sucesso!
        </Alert>
      )}
      {mutation.isError && (
        <Alert severity="error" style={{ width: '100%' }}>
          Ocorreu um erro ao atualizar a Transação. Tente novamente.
        </Alert>
      )}

      {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      {(isPendingCf || isPendingCat || isPendingCp || isPendingCr) && <CustomBackdrop isOpen={true} />}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', minWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 2, width: '100%' }}>
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Valor (R$)"
                  variant="outlined"
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
              variant="outlined"
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
                options={catData ? catData : []}
                getOptionLabel={(option) => option.name || ''}
                onChange={(_, data) => field.onChange(data ? data.id : '')}
                defaultValue={
                  (catData && catData.find((option) => option.id === forms.tx.updateItem?.category)) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categoria"
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
                defaultValue={(cfData && cfData.find((option) => option.id === forms.tx.updateItem?.cf)) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="N. | Ag | Banco - Conta Financeira"
                    variant="outlined"
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

          {account ? (
            <Controller
              name="cp"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={cpData ? cpData : []}
                  getOptionLabel={(option) =>
                    option.id
                      ? `${option.supplier.name} | ${new Date(option.due + 'T00:00:00').toLocaleDateString()} | R$ ${strToPtBrMoney(String(option.value))}`
                      : ''
                  }
                  onChange={(_, data) => field.onChange(data ? data.id : '')}
                  defaultValue={(cpData && cpData.find((option) => option.id === forms.tx.updateItem?.cp)) || null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Fornecedor | Vcto. | Valor - Conta a pagar"
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
                  defaultValue={(crData && crData.find((option) => option.id === forms.tx.updateItem?.cr)) || null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cliente | Vcto. | Valor - Conta a receber"
                      variant="outlined"
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
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <TextField
            label="Observações"
            {...register('obs')}
            variant="outlined"
            error={!!errors.obs}
            helperText={errors.obs?.message}
            multiline
            rows={3}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={statusValue} {...register('status')} />}
            label={`Status: ${statusValue ? 'Ativo' : 'Inativo'}`}
          />
          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Atualizando...' : 'Atualizar Transação'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
