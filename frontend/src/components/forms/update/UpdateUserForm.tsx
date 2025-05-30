import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ButtonUpdateForm from '@/components/ui/ButtonUpdateForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePutUser } from '@/hooks/service/user/usePutUser';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
const { updateUserSchema } = packages;

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export function UpdateUserForm(): JSX.Element | null {
  const { forms } = useFormStore();
  const mutation = usePutUser(forms.user.updateItem ? forms.user.updateItem.id : '');

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: forms.user.updateItem
      ? {
          name: forms.user.updateItem.name,
          surname: forms.user.updateItem.surname,
          cpf: forms.user.updateItem.cpf,
          status: forms.user.updateItem.status,
          role: forms.user.updateItem.role,
          pwd: '',
        }
      : {},
  });

  const statusValue = watch('status');
  const roleValue = watch('role');

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      await mutation.mutateAsync(data);
      reset({
        name: data.name,
        surname: data.surname,
        cpf: data.cpf,
        status: data.status,
        role: data.role,
        pwd: '',
      });
    } catch (err) {
      console.error('Erro ao atualizar o usuário:', err);
    }
  };

  if (forms.user.type === 'create' || !forms.user.updateItem) return null;

  return (
    <FormContainer formName="user">
      <ButtonUpdateForm title="Atualizar usuário" name="user" />

      {mutation.isSuccess && (
        <Alert severity="success" style={{ width: '100%' }}>
          Usuário atualizado com sucesso!
        </Alert>
      )}

      {mutation.isError && (
        <Alert severity="error" style={{ width: '100%' }}>
          Ocorreu um erro ao atualizar o usuário. Tente novamente.
        </Alert>
      )}

      {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', minWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Nome"
            {...register('name')}
            variant="outlined"
            size="small"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Sobrenome"
            {...register('surname')}
            size="small"
            variant="outlined"
            error={!!errors.surname}
            helperText={errors.surname?.message}
          />
          <TextField
            label="CPF"
            {...register('cpf')}
            size="small"
            variant="outlined"
            error={!!errors.cpf}
            helperText={errors.cpf?.message}
          />
          <FormControl variant="outlined" error={!!errors.role}>
            <InputLabel size="small" id="role-type-label">
              Função
            </InputLabel>
            <Select
              size="small"
              labelId="role-type-label"
              label="Função"
              defaultValue={roleValue}
              {...register('role')}
            >
              <MenuItem value="assistant">Assistente</MenuItem>
              <MenuItem value="manager">Gerente</MenuItem>
              <MenuItem value="analist">Assistente</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
            {errors.role && (
              <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>{errors.role.message}</p>
            )}
          </FormControl>
          <TextField
            label="Senha"
            type="password"
            {...register('pwd')}
            size="small"
            variant="outlined"
            error={!!errors.pwd}
            helperText={errors.pwd?.message}
          />
          <FormControlLabel
            control={<Checkbox size="small" checked={statusValue} {...register('status')} />}
            label={`Status: ${statusValue ? 'Ativo' : 'Inativo'}`}
          />
          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Atualizando...' : 'Atualizar Usuário'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
