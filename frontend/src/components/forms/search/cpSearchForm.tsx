import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { JSX } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { PaymentStatus } from '@packages/dtos/utils/enums';
import { queryCpSchema } from '@packages/validators/zod-schemas/query/query-cp.validator';

type QueryCpFormData = z.infer<typeof queryCpSchema>;

interface CpSearchFormProps {
  onSearch: (data: QueryCpFormData) => void;
  onClear: () => void;
}

const CpSearchForm = ({ onSearch, onClear }: CpSearchFormProps): JSX.Element => {
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
      obs: '',
      status: PaymentStatus.PENDING,
      createdAt: '',
      updatedAt: '',
      id: '',
    },
  });

  const statusValue = watch('status');

  const handleClear = () => {
    reset();
    onClear();
  };

  const onSubmit = (data: QueryCpFormData) => {
    console.log(data);
    const cleanedData: Partial<QueryCpFormData> = { ...data };
    (['id', 'value', 'supplier', 'type', 'due', 'obs', 'createdAt', 'updatedAt'] as const).forEach((key) => {
      if (!cleanedData[key]) {
        delete cleanedData[key];
      }
    });
    onSearch(cleanedData);
    reset();
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
        <InputLabel id="cp-status-label-search">Status</InputLabel>
        <Select
          labelId="cp-status-label-search"
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
          size="small"
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
          slotProps={{
            inputLabel: { shrink: true },
          }}
          error={!!errors.updatedAt}
          helperText={errors.updatedAt?.message}
          size="small"
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

export default CpSearchForm;
