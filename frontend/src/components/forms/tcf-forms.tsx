import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { Checkbox, FormControlLabel } from '@mui/material';
import { createTcfSchema } from '../../../../packages/validators/zod-schemas/create/create-tcf.validator'
import { updateTcfSchema } from '../../../../packages/validators/zod-schemas/update/update-tcf.validator'
import { usePostTcf } from '../../hooks/use-tcf';
import { usePutTcf } from '../../hooks/use-tcf';
import { JSX } from 'react';
import { useFormStore } from '../../hooks/use-form-store';


type CreateTcfFormData = z.infer<typeof createTcfSchema>;

type UpdateTcfFormData = z.infer<typeof updateTcfSchema>;


export function CreateTcfForm(): JSX.Element | null {
  const theme = useTheme();
  const mutation = usePostTcf();
  const { forms } = useFormStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTcfFormData>({
    resolver: zodResolver(createTcfSchema),
  });

  const onSubmit = async (data: CreateTcfFormData) => {
    try {
      await mutation.mutateAsync(data);
    } catch (err) {
      console.error("Erro ao enviar o formulário:", err);
    }
  };
  if (forms.tcf.type === 'update') {
    return null
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 0,
        flexShrink: 0,
        padding: 3,
        minHeight: 500,
        alignSelf: "flex-start"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          padding: 4,
          maxWidth: 400,
          borderRadius: 1,
          boxShadow: theme.shadows[24],
          bgcolor:
            theme.palette.mode === "light"
              ? theme.palette.common.white
              : theme.palette.common.black,
        }}
      >
        <h1>Novo TCF</h1>

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

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <TextField
              label="Nome"
              {...register("name")}
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
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
      </Box>
    </Box>
  );
}


export function UpdateTcfForm(): JSX.Element | null {
  const theme = useTheme();
  const mutation = usePutTcf();
  const { forms } = useFormStore();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateTcfFormData>({
    resolver: zodResolver(updateTcfSchema),
    defaultValues: forms.tcf.updateItem || {},
  });

  const statusValue = watch("status");

  const handleFormSubmit = async (data: UpdateTcfFormData) => {
    try {
      console.log("Dados enviados:", data);
      await mutation.mutateAsync(data);
    } catch (err) {
      console.error("Erro ao atualizar o formulário:", err);
    }
  };
  if (forms.tcf.type === 'create' || !forms.tcf.updateItem) {
    return null
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 0,
        flexShrink: 0,
        padding: 3,
        minHeight: 500,
        alignSelf: "flex-start"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          padding: 4,
          maxWidth: 400,
          borderRadius: 1,
          boxShadow: theme.shadows[24],
          bgcolor:
            theme.palette.mode === "light"
              ? theme.palette.common.white
              : theme.palette.common.black,
        }}
      >
      <h1>Atualizar TCF</h1>

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

      <form onSubmit={handleSubmit(handleFormSubmit)} style={{ width: "100%" }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Nome"
            {...register("name")}
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <FormControlLabel
            control={<Checkbox {...register("status")} />}
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
    </Box>
    </Box>
  );
}