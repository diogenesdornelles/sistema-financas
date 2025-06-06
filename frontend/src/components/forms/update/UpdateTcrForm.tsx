import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, FormControlLabel } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ButtonUpdateForm from '@/components/ui/ButtonUpdateForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePutTcr } from '@/hooks/service/tcr/usePutTcr';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { updateTcrSchema } = packages;

type UpdateTcrFormData = z.infer<typeof updateTcrSchema>;

export function UpdateTcrForm(): JSX.Element | null {
  const { forms } = useFormStore();

  const mutation = usePutTcr(forms.tcr.updateItem ? forms.tcr.updateItem.id : '');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateTcrFormData>({
    resolver: zodResolver(updateTcrSchema),
    defaultValues: forms.tcr.updateItem
      ? {
          name: forms.tcr.updateItem.name,
          status: forms.tcr.updateItem.status ? forms.tcr.updateItem.status : false,
        }
      : {},
  });

  const statusValue = watch('status');

  const onSubmit = async (data: UpdateTcrFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset({
        name: data.name,
        status: data.status ? data.status : undefined,
      });
    } catch (err) {
      console.error('Erro ao atualizar o Tipo de conta a receber:', err);
    }
  };
  // Exibe este formulário somente se o modo for 'update' e houver dados para atualizar
  if (forms.tcr.type === 'create' || !forms.tcr.updateItem) return null;

  return (
    <FormContainer formName="tcr">
      <ButtonUpdateForm title="Atualizar Tipo de conta a receber" name="tcr" />

      {mutation.isSuccess && (
        <ToastAlert severity="success" title="Sucesso" message="Tipo alterado com sucesso!" open icon={<DoneIcon />} />
      )}

      {mutation.isError && <ToastAlert severity="error" title="Erro" message={'Erro ao alterar tipo.'} open />}

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
          <FormControlLabel
            control={<Checkbox size="small" checked={statusValue} {...register('status')} />}
            label={`Status: ${statusValue ? 'Ativo' : 'Inativo'}`}
          />

          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Atualizando...' : 'Atualizar Tipo'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
