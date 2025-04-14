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
import { queryCfSchema } from '../../../../../packages/validators/zod-schemas/query/query-cf.validator';
import { JSX } from 'react';

type QueryCfFormData = z.infer<typeof queryCfSchema>;

interface CfSearchFormProps {
  onSearch: (data: QueryCfFormData) => void;
}

const CfSearchForm = ({ onSearch }: CfSearchFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<QueryCfFormData>({
    resolver: zodResolver(queryCfSchema),
    defaultValues: {
      id: '',
      number: '',
      balance: '',
      type: '',
      ag: '',
      bank: '',
      obs: '',
      createdAt: '',
      updatedAt: '',
      status: true,
    },
  });

  const showInactives = watch('status');

  const onSubmit = (data: QueryCfFormData) => {
    const cleanedData: Partial<QueryCfFormData> = { ...data };
    (['id', 'number', 'balance', 'type', 'ag', 'bank', 'createdAt', 'updatedAt'] as const).forEach((key) => {
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
          label="Número"
          {...register('number')}
          variant="outlined"
          error={!!errors.number}
          helperText={errors.number?.message}
          size="small"
        />
        <TextField
          label="Saldo"
          {...register('balance')}
          variant="outlined"
          error={!!errors.balance}
          helperText={errors.balance?.message}
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
          label="Agência"
          {...register('ag')}
          variant="outlined"
          error={!!errors.ag}
          helperText={errors.ag?.message}
          size="small"
        />
        <TextField
          label="Banco"
          {...register('bank')}
          variant="outlined"
          error={!!errors.bank}
          helperText={errors.bank?.message}
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
          label="Criado em"
          size="small"
          {...register('createdAt')}
          variant="outlined"
          type="date"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={!!errors.createdAt}
          helperText={errors.createdAt?.message}
        />
        <TextField
          label="Alterado em"
          {...register('updatedAt')}
          variant="outlined"
          type="date"
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={!!errors.updatedAt}
          helperText={errors.updatedAt?.message}
        />
        <FormControlLabel
          control={<Switch {...register('status')} checked={!!showInactives} />}
          label="Mostrar Inativos"
        />
        <Button type="submit" variant="contained" color="primary">
          Buscar
        </Button>
        <Button type="button" variant="outlined" color="secondary" onClick={() => reset()}>
          Limpar
        </Button>
      </form>
    </Box>
  );
};

export default CfSearchForm;