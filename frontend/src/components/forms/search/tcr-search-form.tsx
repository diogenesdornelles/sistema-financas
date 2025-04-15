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
import { queryTcrSchema } from '../../../../../packages/validators/zod-schemas/query/query-tcr.validator';
import { JSX } from 'react';

type QueryTcrFormData = z.infer<typeof queryTcrSchema>;

interface TcrSearchFormProps {
  onSearch: (data: QueryTcrFormData) => void;
  onClear: () => void;
}

const TcrSearchForm = ({ onSearch, onClear }: TcrSearchFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<QueryTcrFormData>({
    resolver: zodResolver(queryTcrSchema),
    defaultValues: {
      name: '',
      status: false, // não mostrar inativos
      createdAt: '',
      updatedAt: '',
      id: ''
    },
  });

  const handleClear = () => {
    reset();
    onClear();
  };

  const showInactives = watch('status');

  const onSubmit = (data: QueryTcrFormData) => {
    const cleanedData: Partial<QueryTcrFormData> = { ...data };
    (['id', 'name', 'createdAt', 'updatedAt'] as const).forEach((key) => {
      if (!cleanedData[key]) {
        delete cleanedData[key];
      }
    });
    onSearch(cleanedData);
    reset()
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

export default TcrSearchForm;