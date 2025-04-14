import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { createTcfSchema } from '../../../../packages/validators/zod-schemas/create/create-tcf.validator'
import { updateTcfSchema } from '../../../../packages/validators/zod-schemas/update/update-tcf.validator'
import { usePostTcf } from '../../hooks/use-tcf';
import { usePutTcf } from '../../hooks/use-tcf';
import { JSX } from 'react';
import { useFormStore } from '../../hooks/use-form-store';
import FormContainer from './templates/form-container';
import ButtonUpdateForm from './templates/button-update-form';
import CustomBackdrop from '../custom-backdrop';


type CreateTcfFormData = z.infer<typeof createTcfSchema>;

type UpdateTcfFormData = z.infer<typeof updateTcfSchema>;


export function CreateTcfForm(): JSX.Element | null {
  const mutation = usePostTcf();
  const { forms } = useFormStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTcfFormData>({
    resolver: zodResolver(createTcfSchema),
    defaultValues: {
      name: ''
    }
  });

  const onSubmit = async (data: CreateTcfFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset()
    } catch (err) {
      console.error("Erro ao enviar o formulário:", err);
    }
  };
  if (forms.tcf.type === 'update') {
    return null
  }

  return (
    <FormContainer formName='tcf'>
      <Typography variant="h4">Novo Tipo de conta Financeira</Typography>
      {mutation.isSuccess && (
        <Alert severity="success" style={{ width: "100%" }}>
          Formulário enviado com sucesso!
        </Alert>
      )}

      {mutation.isError && (
        <Alert severity="error" style={{ width: "100%" }}>
          Ocorreu um erro ao enviar o formulário. Tente novamente.
        </Alert>
      )}

      {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", minWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <TextField
            label="Nome"
            {...register("name")}
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message}
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Enviando..." : "Enviar"}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}


export function UpdateTcfForm(): JSX.Element | null {
  const { forms } = useFormStore();

  const mutation = usePutTcf(forms.tcf.updateItem ? forms.tcf.updateItem.id : '');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateTcfFormData>({
    resolver: zodResolver(updateTcfSchema),
    defaultValues: forms.tcf.updateItem ? {
      name: forms.tcf.updateItem.name,
      status: forms.tcf.updateItem.status ? forms.tcf.updateItem.status : undefined
    } : {},
  });

  const statusValue = watch("status");

  const handleFormSubmit = async (data: UpdateTcfFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset()
    } catch (err) {
      console.error("Erro ao atualizar o formulário:", err);
    }
  };
  if (forms.tcf.type === 'create' || !forms.tcf.updateItem) {
    return null
  }

  return (
    <FormContainer formName='tcf'>
      <ButtonUpdateForm title="Atualizar Tipo de conta financeira" name='tcf' />

      {mutation.isSuccess && (
        <Alert severity="success" style={{ width: "100%" }}>
          Atualização realizada com sucesso!
        </Alert>
      )}

      {mutation.isError && (
        <Alert severity="error" style={{ width: "100%" }}>
          Ocorreu um erro ao atualizar o formulário. Tente novamente.
        </Alert>
      )}

      {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      <form onSubmit={handleSubmit(handleFormSubmit)} style={{ width: "100%", minWidth: 500 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nome"
            {...register("name")}
            variant="outlined"
            size="small"
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <FormControlLabel
            control={<Checkbox size="small" checked={statusValue} {...register("status")} />}
            label={`Status: ${statusValue ? "Ativo" : "Inativo"}`}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Atualizando..." : "Atualizar"}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}