import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { queryUserSchema } from '../../../../../packages/validators/zod-schemas/query/query-user.validator';
import { JSX } from 'react';

type QueryUserFormData = z.infer<typeof queryUserSchema>;

interface UserSearchFormProps {
  onSearch: (data: QueryUserFormData) => void;
}

const UserSearchForm = ({ onSearch }: UserSearchFormProps): JSX.Element => {
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
      status: true,
      createdAt: '',
      updatedAt: '',
    },
  });

  const showInactives = watch('status');

  const onSubmit = (data: QueryUserFormData) => {
    const cleanedData: Partial<QueryUserFormData> = { ...data };
    (['id', 'name', 'surname', 'cpf', 'createdAt', 'updatedAt'] as const).forEach((key) => {
      if (!cleanedData[key]) {
        delete cleanedData[key];
      }
    });
    onSearch(cleanedData);
    handleReset()
  };

  const handleReset = () => {
    reset({
      name: '',
      id: '',
      surname: '',
      cpf: '',
      status: true,
      createdAt: '',
      updatedAt: '',
    });
    onSearch({} as QueryUserFormData); // Envia filtro limpo
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
        <Button type="button" variant="outlined" color="secondary" onClick={handleReset}>
          Limpar
        </Button>
      </form>
    </Box>
  );
};

export default UserSearchForm;