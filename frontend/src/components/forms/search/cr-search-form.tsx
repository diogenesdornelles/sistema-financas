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
import { queryCrSchema } from '../../../../../packages/validators/zod-schemas/query/query-cr.validator';
import { JSX } from 'react';

type QueryCrFormData = z.infer<typeof queryCrSchema>;

interface CrSearchFormProps {
  onSearch: (data: QueryCrFormData) => void;
}

const CrSearchForm = ({ onSearch }: CrSearchFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<QueryCrFormData>({
    resolver: zodResolver(queryCrSchema),
    defaultValues: {
      value: '',
      type: '',
      customer: '',
      due: '',
      rdate: '',
      obs: '',
      status: undefined,
      tx: '',
      createdAt: '',
      updatedAt: '',
    },
  });

  const showInactives = watch('status');

  const onSubmit = (data: QueryCrFormData) => {
    const cleanedData: Partial<QueryCrFormData> = { ...data };
    (['value', 'customer', 'type', 'due', 'rdate', 'tx', 'obs', 'createdAt', 'updatedAt'] as const).forEach((key) => {
      if (!cleanedData[key]) {
        delete cleanedData[key];
      }
    });
    onSearch(cleanedData);
  };

  const handleReset = () => {
    reset({
      value: '',
      type: '',
      customer: '',
      due: '',
      rdate: '',
      obs: '',
      status: undefined,
      tx: '',
      createdAt: '',
      updatedAt: '',
    });
    onSearch({} as QueryCrFormData); // Envia filtro limpo
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
          label="Valor"
          {...register('value')}
          variant="outlined"
          error={!!errors.value}
          helperText={errors.value?.message}
          size="small"
        />
        <TextField
          label="Tipo"
          {...register('type')}
          variant="outlined"
          error={!!errors.type}
          helperText={errors.type?.message}
          size="small"
        />
        <TextField
          label="Cliente"
          {...register('customer')}
          variant="outlined"
          error={!!errors.customer}
          helperText={errors.customer?.message}
          size="small"
        />
        <TextField
          label="Vencimento"
          {...register('due')}
          variant="outlined"
          type="date"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={!!errors.due}
          helperText={errors.due?.message}
          size="small"
        />
        <TextField
          label="Recebimento"
          {...register('rdate')}
          variant="outlined"
          type="date"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={!!errors.rdate}
          helperText={errors.rdate?.message}
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
          label="Transação"
          {...register('tx')}
          variant="outlined"
          error={!!errors.tx}
          helperText={errors.tx?.message}
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

export default CrSearchForm;