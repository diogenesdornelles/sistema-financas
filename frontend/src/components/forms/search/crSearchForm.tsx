import { zodResolver } from '@hookform/resolvers/zod';
import * as packages from '@monorepo/packages';
import { Box, Button, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
const { queryCrSchema, PaymentStatus } = packages;

type QueryCrFormData = z.infer<typeof queryCrSchema>;

interface CrSearchFormProps {
  onSearch: (data: QueryCrFormData) => void;
  onClear: () => void;
}

const CrSearchForm = ({ onSearch, onClear }: CrSearchFormProps): JSX.Element => {
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
      obs: '',
      status: PaymentStatus.PENDING,
      createdAt: '',
      updatedAt: '',
      id: '',
    },
  });

  const statusValue = watch('status');

  const showInactives = watch('status');

  const onSubmit = (data: QueryCrFormData) => {
    const cleanedData: Partial<QueryCrFormData> = { ...data };
    (['id', 'value', 'customer', 'type', 'due', 'obs', 'createdAt', 'updatedAt'] as const).forEach((key) => {
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
        <InputLabel id="cr-status-label-search">Status</InputLabel>
        <Select
          labelId="cr-status-label-search"
          label="Status"
          size="small"
          defaultValue={statusValue}
          {...register('status')}
        >
          <MenuItem value="pending">Pendente</MenuItem>
          <MenuItem value="paid">Pago</MenuItem>
          <MenuItem value="cancelled">Cancelado</MenuItem>
        </Select>
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
          label="Observações"
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

export default CrSearchForm;
