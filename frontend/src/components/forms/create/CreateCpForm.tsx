import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import { JSX } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import DoneIcon from '@mui/icons-material/Done';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePostCp } from '@/hooks/service/cp/usePostCp';
import { useGetAllPartner } from '@/hooks/service/partner/useGetAllPartner';
import { useGetAllTcp } from '@/hooks/service/tcp/useGetAllTcp';
import { useAuth } from '@/hooks/useAuth';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { createCpSchema, strToPtBrMoney } = packages;

type CreateCpFormData = z.infer<typeof createCpSchema>;

export function CreateCpForm(): JSX.Element | null {
  const mutation = usePostCp();
  const { forms } = useFormStore();
  const { isPending: isPendingTcp, error: errorTcp, data: tcpData } = useGetAllTcp();
  const { isPending: isPendingPartner, error: errorPartner, data: partnerData } = useGetAllPartner();
  const { session } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateCpFormData>({
    resolver: zodResolver(createCpSchema),
    mode: 'onSubmit',
    defaultValues: {
      value: '0,00',
      type: '',
      supplier: '',
      due: '', // data atual
      obs: '',
      user: session ? session.user.id : '',
    },
  });

  const onSubmit = async (data: CreateCpFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset();
    } catch (err) {
      console.error('Erro ao criar Conta:', err);
    }
  };

  if (forms.cp.type === 'update') return null;

  return (
    <FormContainer formName="cp">
      <Typography variant="h4">Nova Conta a Pagar</Typography>

      {(errorTcp || errorPartner) && <ToastAlert severity="error" title="Erro" message={'Erro ao criar conta.'} open />}

      {mutation.isSuccess && (
        <ToastAlert
          severity="success"
          title="Sucesso"
          message="Conta criada com sucesso!"
          open
          icon={<DoneIcon />}
        />
      )}

      {mutation.isError && <ToastAlert severity="error" title="Erro" message={'Erro ao criar conta.'} open />}

      {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      {(isPendingTcp || isPendingPartner) && <CustomBackdrop isOpen={mutation.isPending} />}

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
                  size="small"
                  variant="outlined"
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
              label="Vencimento"
              {...register('due')}
              size="small"
              variant="outlined"
              sx={{ width: '100%' }}
              error={!!errors.due}
              helperText={errors.due?.message}
              type="date"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Box>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={tcpData ? tcpData : []}
                getOptionLabel={(option) => option.name || ''}
                onChange={(_, data) => field.onChange(data ? data.id : '')}
                value={field.value ? tcpData?.find((option) => option.id === field.value) || null : null}
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
                value={field.value ? partnerData?.find((option) => option.id === field.value) || null : null}
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
            {mutation.isPending ? 'Enviando...' : 'Criar Conta'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
