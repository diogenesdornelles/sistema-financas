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
import { usePutTcp } from '@/hooks/service/tcp/usePutTcp';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { updateTcpSchema } = packages;

type UpdateTcpFormData = z.infer<typeof updateTcpSchema>;

export function UpdateTcpForm(): JSX.Element | null {
  const { forms } = useFormStore();

  const mutation = usePutTcp(forms.tcp.updateItem ? forms.tcp.updateItem.id : '');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateTcpFormData>({
    resolver: zodResolver(updateTcpSchema),
    defaultValues: forms.tcp.updateItem
      ? {
          name: forms.tcp.updateItem.name,
          status: forms.tcp.updateItem.status ? forms.tcp.updateItem.status : undefined,
        }
      : {},
  });

  const statusValue = watch('status');

  const onSubmit = async (data: UpdateTcpFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset({
        name: data.name,
        status: data.status ? data.status : undefined,
      });
    } catch (err) {
      console.error('Erro ao atualizar o Tipo de conta a paga:', err);
    }
  };

  // Exibe este formulário somente se o modo for 'update' e houver dados para atualizar
  if (forms.tcp.type === 'create' || !forms.tcp.updateItem) return null;

  return (
    <FormContainer formName="tcp">
      <ButtonUpdateForm title="Atualizar Tipo de conta a paga" name="tcp" />

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
