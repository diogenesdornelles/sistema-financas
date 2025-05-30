import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import CustomBackdrop from '@/components/ui/CustomBackdrop';
import FormContainer from '@/components/ui/FormContainer';
import { usePostUser } from '@/hooks/service/user/usePostUser';
import { useFormStore } from '@/hooks/useFormStore';
import * as packages from '@monorepo/packages';
const { createUserRepPwdSchema, RoleType } = packages;

type CreateUserFormData = z.infer<typeof createUserRepPwdSchema>;

export function CreateUserForm(): JSX.Element | null {
  const mutation = usePostUser();
  const { forms } = useFormStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserRepPwdSchema),
    defaultValues: {
      name: '',
      surname: '',
      cpf: '',
      pwd: '',
      confirmPwd: '',
      role: RoleType.ASSISTANT,
    },
  });

  const roleValue = watch('role');

  const onSubmit = async (data: CreateUserFormData) => {
    // Removemos o campo "confirmPwd" antes de enviar os dados
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPwd, ...payload } = data;
    try {
      await mutation.mutateAsync(payload);
      reset();
    } catch (err) {
      console.error('Erro ao enviar o formulário:', err);
    }
  };
  // Exibe o formulário de criação somente se o formStore indicar modo "create"
  if (forms.user.type === 'update') return null;

  return (
    <FormContainer formName="user">
      <Typography variant="h4">Novo Usuário</Typography>
      {mutation.isSuccess && (
        <Alert severity="success" style={{ width: '100%' }}>
          Usuário criado com sucesso!
        </Alert>
      )}

      {mutation.isError && (
        <Alert severity="error" style={{ width: '100%' }}>
          Ocorreu um erro ao criar o usuário. Tente novamente.
        </Alert>
      )}

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
          <TextField
            label="Sobrenome"
            {...register('surname')}
            variant="outlined"
            error={!!errors.surname}
            helperText={errors.surname?.message}
            size="small"
          />
          <TextField
            label="CPF"
            {...register('cpf')}
            variant="outlined"
            error={!!errors.cpf}
            helperText={errors.cpf?.message}
            size="small"
          />
          <TextField
            label="Senha"
            type="password"
            {...register('pwd')}
            variant="outlined"
            error={!!errors.pwd}
            size="small"
            helperText={errors.pwd?.message}
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
            label="Repita a Senha"
            type="password"
            {...register('confirmPwd')}
            variant="outlined"
            error={!!errors.confirmPwd}
            helperText={errors.confirmPwd?.message}
            size="small"
          />
          <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Enviando...' : 'Criar Usuário'}
          </Button>
        </Box>
      </form>
    </FormContainer>
  );
}
