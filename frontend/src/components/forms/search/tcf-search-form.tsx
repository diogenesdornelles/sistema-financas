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
import { queryTcfSchema } from '../../../../../packages/validators/zod-schemas/query/query-tcf.validator';
import { JSX } from 'react';

type QueryTcfFormData = z.infer<typeof queryTcfSchema>;

interface TcfSearchFormProps {
  onSearch: (data: QueryTcfFormData) => void;
}

const TcfSearchForm = ({ onSearch }: TcfSearchFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<QueryTcfFormData>({
    resolver: zodResolver(queryTcfSchema),
    defaultValues: {
      name: '',
      status: undefined,
      createdAt: '',
      updatedAt: '',
    },
  });

  const showInactives = watch('status');

  const onSubmit = (data: QueryTcfFormData) => {
    const cleanedData: Partial<QueryTcfFormData> = { ...data };
    (['name', 'createdAt', 'updatedAt'] as const).forEach((key) => {
      if (!cleanedData[key]) {
        delete cleanedData[key];
      }
    });
    onSearch(cleanedData);
  };

  const handleReset = () => {
    reset({
      name: '',
      status: undefined,
      createdAt: '',
      updatedAt: '',
    });
    onSearch({} as QueryTcfFormData); // Envia filtro limpo
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
          label="Nome"
          {...register('name')}
          variant="outlined"
          error={!!errors.name}
          helperText={errors.name?.message}
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
          size="small"
          helperText={errors.createdAt?.message}
        />
        <TextField
          label="Alteração"
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

export default TcfSearchForm;