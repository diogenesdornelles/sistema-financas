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
import { queryCatSchema } from '../../../../../packages/validators/zod-schemas/query/query-cat.validator';
import { JSX } from 'react';

type QueryCatFormData = z.infer<typeof queryCatSchema>;

interface CatSearchFormProps {
  onSearch: (data: QueryCatFormData) => void;
  onClear: () => void;
}

const CatSearchForm = ({ onSearch, onClear }: CatSearchFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<QueryCatFormData>({
    resolver: zodResolver(queryCatSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      obs: '',
      createdAt: '',
      updatedAt: '',
      status: false, // não mostrar inativos
    },
  });

  const showInactives = watch('status');

  const handleClear = () => {
    reset();
    onClear();
  };

  const onSubmit = (data: QueryCatFormData) => {

    const cleanedData: Partial<QueryCatFormData> = { ...data };
    
    (['id', 'name', 'description', 'obs', 'createdAt', 'updatedAt'] as const).forEach((key) => {
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
          label="Descrição"
          {...register('description')}
          variant="outlined"
          error={!!errors.description}
          helperText={errors.description?.message}
          size="small"
        />
        <TextField
          label="Observação"
          {...register('obs')}
          variant="outlined"
          error={!!errors.obs}
          helperText={errors.obs?.message}
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

export default CatSearchForm;
