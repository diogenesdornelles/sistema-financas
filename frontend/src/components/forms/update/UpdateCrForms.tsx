import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { JSX } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import DoneIcon from '@mui/icons-material/Done';
import ButtonUpdateForm from '@/components/ui/ButtonUpdateForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePutCr } from '@/hooks/service/cr/usePutCr';
import { useGetAllPartner } from '@/hooks/service/partner/useGetAllPartner';
import { useGetAllTcr } from '@/hooks/service/tcr/useGetAllTcr';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { updateCrSchema, strToPtBrMoney } = packages;

type UpdateCrFormData = z.infer<typeof updateCrSchema>;

export function UpdateCrForm(): JSX.Element | null | string {
  const { forms } = useFormStore();

  const mutation = usePutCr(forms.cr.updateItem ? forms.cr.updateItem.id : '');
  const { isPending: isPendingTcr, error: errorTcr, data: tcrData } = useGetAllTcr();
  const { isPending: isPendingPartner, error: errorPartner, data: partnerData } = useGetAllPartner();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateCrFormData>({
    resolver: zodResolver(updateCrSchema),
    defaultValues: forms.cr.updateItem
      ? {
          type: forms.cr.updateItem.type,
          customer: forms.cr.updateItem.customer,
          due: forms.cr.updateItem.due ? String(forms.cr.updateItem.due) : '',
          obs: forms.cr.updateItem.obs ? forms.cr.updateItem.obs : '',
          value: strToPtBrMoney(forms.cr.updateItem?.value || ''),
        }
      : {},
  });

  const onSubmit = async (data: UpdateCrFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset({
        type: data.type,
        customer: data.customer,
        due: data.due ? String(data.due) : '',
        obs: data.obs ? data.obs : '',
        value: strToPtBrMoney(data.value || ''),
      });
    } catch (err) {
      console.error('Erro ao atualizar a Conta:', err);
    }
  };

  if (forms.cr.type === 'create' || !forms.cr.updateItem) return null;

  return (
    <FormContainer formName="cr">
      <ButtonUpdateForm name="cr" title="Atualizar Conta a Receber" />
      {(errorTcr || errorPartner) && <ToastAlert severity="error" title="Erro" message={'Erro ao alterar conta.'} open />}
      {mutation.isSuccess && (
        <ToastAlert
          severity="success"
          title="Sucesso"
          message="Conta alterada com sucesso!"
          open
          icon={<DoneIcon />}
        />
      )}

      {mutation.isError && <ToastAlert severity="error" title="Erro" message={'Erro ao alterar conta.'} open />}

      {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      {(isPendingTcr || isPendingPartner) && <CustomBackdrop isOpen={true} />}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', minWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Valor (R$)"
                size="small"
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
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={tcrData ? tcrData : []}
                getOptionLabel={(option) => option.name || ''}
                onChange={(_, data) => field.onChange(data ? data.id : '')}
                defaultValue={(tcrData && tcrData.find((option) => option.id === forms.cr.updateItem?.type)) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipo (Tcr)"
                    variant="outlined"
                    size="small"
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  />
                )}
              />
            )}
          />
          <Controller
            name="customer"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={partnerData ? partnerData : []}
                getOptionLabel={(option) => option.name || ''}
                onChange={(_, data) => field.onChange(data ? data.id : '')}
                defaultValue={
                  (partnerData && partnerData.find((option) => option.id === forms.cr.updateItem?.customer)) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cliente"
                    variant="outlined"
                    size="small"
                    error={!!errors.customer}
                    helperText={errors.customer?.message}
                  />
                )}
              />
            )}
          />
          <TextField
            label="Vencimento"
            {...register('due')}
            variant="outlined"
            size="small"
            error={!!errors.due}
            helperText={errors.due?.message}
            type="date"
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
          <TextField
            label="Observações"
            {...register('obs')}
            variant="outlined"
            size="small"
            error={!!errors.obs}
            helperText={errors.obs?.message}
            multiline
            rows={3}
          />
          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Atualizando...' : 'Atualizar Conta'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
