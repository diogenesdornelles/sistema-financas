import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DoneIcon from '@mui/icons-material/Done';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePostPartner } from '@/hooks/service/partner/usePostPartner';
import { useAuth } from '@/hooks/useAuth';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { createPartnerSchema, PartnerType } = packages;

type CreatePartnerFormData = z.infer<typeof createPartnerSchema>;

export function CreatePartnerForm(): JSX.Element | null {
  const mutation = usePostPartner();
  const { forms } = useFormStore();
  const { session } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreatePartnerFormData>({
    resolver: zodResolver(createPartnerSchema),
    defaultValues: {
      name: '',
      cod: '',
      user: session ? session?.user.id : '',
      obs: '',
      type: PartnerType.PJ,
    },
  });

  const typeValue = watch('type');

  const onSubmit = async (data: CreatePartnerFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset();
    } catch (err) {
      console.error('Erro ao criar parceiro:', err);
    }
  };

  if (forms.partner.type === 'update') return null;

  return (
    <FormContainer formName="partner">
      <Typography variant="h4">Novo Parceiro</Typography>

      {mutation.isSuccess && (
        <ToastAlert
          severity="success"
          title="Sucesso"
          message="Parceiro criado com sucesso!"
          open
          icon={<DoneIcon />}
        />
      )}

      {mutation.isError && <ToastAlert severity="error" title="Erro" message={'Erro ao criar parceiro.'} open />}

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
            <InputLabel size="small" id="partner-type-label">
              Tipo
            </InputLabel>
            <Select
              size="small"
              labelId="partner-type-label"
              label="Tipo"
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
            label="Código (CPF/CNPJ)"
            {...register('cod')}
            variant="outlined"
            error={!!errors.cod}
            size="small"
            helperText={errors.cod?.message}
          />

          <TextField
            label="Observações"
            {...register('obs')}
            variant="outlined"
            error={!!errors.obs}
            helperText={errors.obs?.message}
            multiline
            size="small"
            rows={3}
          />

          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Enviando...' : 'Criar Parceiro'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
