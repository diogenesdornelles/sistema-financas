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
import { queryCpSchema } from '../../../../../packages/validators/zod-schemas/query/query-cp.validator';
import { JSX } from 'react';

type QueryCpFormData = z.infer<typeof queryCpSchema>;

interface CpSearchFormProps {
  onSearch: (data: QueryCpFormData) => void;
}

const CpSearchForm = ({ onSearch }: CpSearchFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<QueryCpFormData>({
    resolver: zodResolver(queryCpSchema),
    defaultValues: {
      value: '',
      type: '',
      supplier: '',
      due: '',
      pdate: '',
      obs: '',
      status: undefined,
      tx: '',
      createdAt: '',
      updatedAt: '',
    },
  });

  const showInactives = watch('status');

  const onSubmit = (data: QueryCpFormData) => {
    const cleanedData: Partial<QueryCpFormData> = { ...data };
    (['value', 'supplier', 'type', 'due', 'pdate', 'tx', 'obs', 'createdAt', 'updatedAt'] as const).forEach((key) => {
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
      supplier: '',
      due: '',
      pdate: '',
      obs: '',
      status: undefined,
      tx: '',
      createdAt: '',
      updatedAt: '',
    });
    onSearch({} as QueryCpFormData); // Envia filtro limpo
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
          label="Fornecedor"
          {...register('supplier')}
          variant="outlined"
          error={!!errors.supplier}
          helperText={errors.supplier?.message}
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
          label="Pagamento"
          {...register('pdate')}
          variant="outlined"
          type="date"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={!!errors.pdate}
          helperText={errors.pdate?.message}
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
          label="Criação"
          {...register('createdAt')}
          variant="outlined"
          size="small"
          type="date"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={!!errors.createdAt}
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

export default CpSearchForm;