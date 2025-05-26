import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { queryUserSchema } from '@packages/validators/zodSchemas/query/queryUserValidator';
import { RoleSearchType } from '@packages/dtos/utils/enums';

type QueryUserFormData = z.infer<typeof queryUserSchema>;

interface UserSearchFormProps {
  onSearch: (data: QueryUserFormData) => void;
  onClear: () => void;
}

const UserSearchForm = ({ onSearch, onClear }: UserSearchFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<QueryUserFormData>({
    resolver: zodResolver(queryUserSchema),
    defaultValues: {
      name: '',
      id: '',
      surname: '',
      cpf: '',
      status: false, // não mostrar inativos
      createdAt: '',
      updatedAt: '',
      role: RoleSearchType.ALL,
    },
  });

  const showInactives = watch('status');

  const onSubmit = (data: QueryUserFormData) => {
    const cleanedData: Partial<QueryUserFormData> = { ...data };
    (['id', 'name', 'surname', 'cpf', 'createdAt', 'updatedAt', 'role'] as const).forEach((key) => {
      if (!cleanedData[key]) {
        delete cleanedData[key];
      }
    });
    onSearch(cleanedData);
    reset();
  };
  const handleClear = () => {
    reset();
    onClear();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
        }}
      >
        <TextField
          label="ID"
          {...register('id')}
          variant="outlined"
          error={!!errors.id}
          helperText={errors.id?.message}
          size="small"
        />
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
        <FormControl variant="outlined" error={!!errors.role}>
          <InputLabel id="role-type-label-search" size="small">
            Função
          </InputLabel>
          <Select
            sx={{ width: 100 }}
            labelId="role-type-label-search"
            label="Função"
            size="small"
            defaultValue={RoleSearchType.ALL}
            {...register('role')}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="assistant">Assistente</MenuItem>
            <MenuItem value="manager">Gerente</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="analist">Analista</MenuItem>
          </Select>
          {errors.role && (
            <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>{errors.role.message}</p>
          )}
        </FormControl>
        <TextField
          label="Criado em"
          {...register('createdAt')}
          variant="outlined"
          type="date"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={!!errors.createdAt}
          helperText={errors.createdAt?.message}
          size="small"
        />

        <TextField
          label="Alterado em"
          {...register('updatedAt')}
          variant="outlined"
          type="date"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={!!errors.updatedAt}
          helperText={errors.updatedAt?.message}
          size="small"
        />
        <FormControlLabel
          control={<Switch {...register('status')} checked={!!showInactives} />}
          label="Mostrar Inativos"
        />
        <Button type="submit" variant="contained" color="primary">
          Buscar
        </Button>
        <Button type="button" variant="outlined" color="secondary" onClick={handleClear}>
          Limpar
        </Button>
      </form>
    </Box>
  );
};

export default UserSearchForm;
