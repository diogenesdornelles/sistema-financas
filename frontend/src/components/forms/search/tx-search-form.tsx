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
import { queryTxSchema } from '../../../../../packages/validators/zod-schemas/query/query-tx.validator';
import { JSX } from 'react';

type QueryTxFormData = z.infer<typeof queryTxSchema>;

interface TxSearchFormProps {
  onSearch: (data: QueryTxFormData) => void;
}

const TxSearchForm = ({ onSearch }: TxSearchFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<QueryTxFormData>({
    resolver: zodResolver(queryTxSchema),
    defaultValues: {
      id: '',
      value: '',
      cf: '',
      cr: '',
      cp: '',
      description: '',
      category: '',
      obs: '',
      status: true,
      tdate: '',
      createdAt: '',
      updatedAt: '',
    },
  });

  const showInactives = watch('status');

  const onSubmit = (data: QueryTxFormData) => {
    const cleanedData: Partial<QueryTxFormData> = { ...data };
    (['id', 'value', 'cf', 'cp', 'cr', 'description', 'category', 'tdate', 'obs', 'createdAt', 'updatedAt'] as const).forEach((key) => {
      if (!cleanedData[key]) {
        delete cleanedData[key];
      }
    });
    onSearch(cleanedData);
    handleReset()
  };

  const handleReset = () => {
    reset({
      id: '',
      value: '',
      cf: '',
      cr: '',
      cp: '',
      description: '',
      category: '',
      obs: '',
      status: true,
      tdate: '',
      createdAt: '',
      updatedAt: '',
    });
    onSearch({} as QueryTxFormData); // Envia filtro limpo
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
          label="Valor"
          {...register('value')}
          variant="outlined"
          error={!!errors.value}
          helperText={errors.value?.message}
          size="small"
        />
        <TextField
          label="ID Conta a Receber"
          {...register('cr')}
          variant="outlined"
          error={!!errors.cr}
          helperText={errors.cr?.message}
          size="small"
        />
        <TextField
          label="ID Conta a Pagar"
          {...register('cp')}
          variant="outlined"
          error={!!errors.cp}
          helperText={errors.cp?.message}
          size="small"
        />
        <TextField
          label="ID Conta Financeira"
          {...register('cf')}
          variant="outlined"
          error={!!errors.cf}
          helperText={errors.cf?.message}
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
          label="Categoria"
          {...register('category')}
          variant="outlined"
          error={!!errors.category}
          helperText={errors.category?.message}
          size="small"
        />
        <TextField
          label="Observações"
          {...register('obs')}
          variant="outlined"
          error={!!errors.obs}
          helperText={errors.obs?.message}
          size="small"
        />
        <TextField
          label="Data da Transação"
          {...register('tdate')}
          variant="outlined"
          type="date"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={!!errors.tdate}
          helperText={errors.tdate?.message}
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

export default TxSearchForm;