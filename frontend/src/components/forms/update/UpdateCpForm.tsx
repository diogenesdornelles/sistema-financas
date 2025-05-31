import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Box, Button, InputLabel, TextField } from '@mui/material';
import { JSX } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import DoneIcon from '@mui/icons-material/Done';
import ButtonUpdateForm from '@/components//ui/ButtonUpdateForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePutCp } from '@/hooks/service/cp/usePutCp';
import { useGetAllPartner } from '@/hooks/service/partner/useGetAllPartner';
import { useGetAllTcp } from '@/hooks/service/tcp/useGetAllTcp';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { updateCpSchema, strToPtBrMoney } = packages;

type UpdateCpFormData = z.infer<typeof updateCpSchema>;

export function UpdateCpForm(): JSX.Element | null {
  const { forms } = useFormStore();
  const mutation = usePutCp(forms.cp.updateItem ? forms.cp.updateItem.id : '');
  const { isPending: isPendingTcp, error: errorTcp, data: tcpData } = useGetAllTcp();
  const { isPending: isPendingPartner, error: errorPartner, data: partnerData } = useGetAllPartner();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateCpFormData>({
    resolver: zodResolver(updateCpSchema),
    defaultValues: forms.cp.updateItem
      ? {
          type: forms.cp.updateItem.type,
          supplier: forms.cp.updateItem.supplier,
          due: String(forms.cp.updateItem.due),
          value: strToPtBrMoney(forms.cp.updateItem?.value || ''),
        }
      : {},
  });

  const onSubmit = async (data: UpdateCpFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset({
        type: data.type,
        supplier: data.supplier,
        due: String(data.due),
        value: strToPtBrMoney(data.value || ''),
      });
    } catch (err) {
      console.error('Erro ao atualizar Conta:', err);
    }
  };

  if (forms.cp.type === 'create' || !forms.cp.updateItem) return null;

  return (
    <FormContainer formName="cp">
      <ButtonUpdateForm name="cp" title="Atualizar Conta a Pagar" />

      {(errorTcp || errorPartner) && <ToastAlert severity="error" title="Erro" message={'Erro ao alterar conta.'} open />}
      
      {(isPendingTcp || isPendingPartner) && <CustomBackdrop isOpen={true} />}

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

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', minWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Valor (R$)"
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
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={tcpData ? tcpData : []}
                getOptionLabel={(option) => option.name || ''}
                onChange={(_, data) => field.onChange(data ? data.id : '')}
                defaultValue={(tcpData && tcpData.find((option) => option.id === forms.cp.updateItem?.type)) || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipo"
                    size="small"
                    variant="outlined"
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  />
                )}
              />
            )}
          />
          <Controller
            name="supplier"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={partnerData ? partnerData : []}
                getOptionLabel={(option) => option.name || ''}
                onChange={(_, data) => field.onChange(data ? data.id : '')}
                defaultValue={
                  (partnerData && partnerData.find((option) => option.id === forms.cp.updateItem?.supplier)) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Fornecedor"
                    size="small"
                    variant="outlined"
                    error={!!errors.supplier}
                    helperText={errors.supplier?.message}
                  />
                )}
              />
            )}
          />
          <TextField
            label="Vencimento"
            {...register('due')}
            size="small"
            variant="outlined"
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
            error={!!errors.obs}
            size="small"
            helperText={errors.obs?.message}
            multiline
            rows={3}
          />
          <InputLabel id="cp-status-label-update">Status</InputLabel>
          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Atualizando...' : 'Atualizar Conta'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
