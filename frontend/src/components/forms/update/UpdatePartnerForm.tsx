import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DoneIcon from '@mui/icons-material/Done';
import ButtonUpdateForm from '@/components/ui/ButtonUpdateForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePutPartner } from '@/hooks/service/partner/usePutPartner';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { updatePartnerSchema } = packages;

type UpdatePartnerFormData = z.infer<typeof updatePartnerSchema>;

export function UpdatePartnerForm(): JSX.Element | null {
  const { forms } = useFormStore();
  const mutation = usePutPartner(forms.partner.updateItem ? forms.partner.updateItem.id : '');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdatePartnerFormData>({
    resolver: zodResolver(updatePartnerSchema),
    defaultValues: forms.partner.updateItem
      ? {
          name: forms.partner.updateItem.name,
          type: forms.partner.updateItem.type ? forms.partner.updateItem.type : undefined,
          cod: forms.partner.updateItem.cod,
          obs: forms.partner.updateItem.obs ? forms.partner.updateItem.obs : '',
          status: forms.partner.updateItem.status ? forms.partner.updateItem.status : undefined,
        }
      : {},
  });

  const statusValue = watch('status');

  const typeValue = watch('type');

  const onSubmit = async (data: UpdatePartnerFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset({
        name: data.name,
        type: data.type ? data.type : undefined,
        cod: data.cod,
        obs: data.obs ? data.obs : '',
        status: data.status ? data.status : undefined,
      });
    } catch (err) {
      console.error('Erro ao atualizar Parceiro:', err);
    }
  };

  if (forms.partner.type === 'create' || !forms.partner.updateItem) return null;

  return (
    <FormContainer formName="partner">
      <ButtonUpdateForm title="Atualizar Parceiro" name="partner" />

      {mutation.isSuccess && (
        <ToastAlert
          severity="success"
          title="Sucesso"
          message="Parceiro alterado com sucesso!"
          open
          icon={<DoneIcon />}
        />
      )}

      {mutation.isError && <ToastAlert severity="error" title="Erro" message={'Erro ao alterar parceiro.'} open />}

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

          <FormControl variant="outlined" error={!!errors.type}>
            <InputLabel id="partner-type-label-update">Tipo</InputLabel>
            <Select
              labelId="partner-type-label-update"
              label="Tipo"
              size="small"
              defaultValue={typeValue}
              {...register('type')}
            >
              <MenuItem value="PF">PF</MenuItem>
              <MenuItem value="PJ">PJ</MenuItem>
            </Select>
            {errors.type && (
              <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>{errors.type.message}</p>
            )}
          </FormControl>

          <TextField
            label="Código"
            {...register('cod')}
            variant="outlined"
            error={!!errors.cod}
            helperText={errors.cod?.message}
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

          <FormControlLabel
            control={<Checkbox size="small" checked={statusValue} {...register('status')} />}
            label={`Status: ${statusValue ? 'Ativo' : 'Inativo'}`}
          />

          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Atualizando...' : 'Atualizar Parceiro'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
