import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { queryTxSchema } from '../../../../../packages/validators/zod-schemas/query/query-tx.validator';
import { JSX } from 'react';
import { TransactionSearchType } from '../../../../../packages/dtos/utils/enums';

type QueryTxFormData = z.infer<typeof queryTxSchema>;

interface TxSearchFormProps {
  onSearch: (data: QueryTxFormData) => void;
  onClear: () => void;
}



const TxSearchForm = ({ onSearch, onClear }: TxSearchFormProps): JSX.Element => {
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
      status: false, // não mostrar inativos
      tdate: '',
      createdAt: '',
      updatedAt: '',
      type: TransactionSearchType.BOTH
    },
  });

  const handleClear = () => {
    reset();
    onClear();
  };
  const showInactives = watch('status');

  const onSubmit = (data: QueryTxFormData) => {
    const cleanedData: Partial<QueryTxFormData> = { ...data };
    (['id', 'value', 'cf', 'cp', 'cr', 'description', 'type', 'category', 'tdate', 'obs', 'createdAt', 'updatedAt'] as const).forEach((key) => {
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
        <FormControl variant="outlined" error={!!errors.type}>
          <InputLabel id="tx-type-label-search" size='small'>Tipo</InputLabel>
          <Select
            sx={{ width: 100 }}
            labelId="tx-type-label-search"
            label="Tipo"
            size="small"
            defaultValue={TransactionSearchType.BOTH}
            {...register("type")}
          >
            <MenuItem value="entry">Entrada</MenuItem>
            <MenuItem value="outflow">Saída</MenuItem>
            <MenuItem value="entryoutflow">Ambos</MenuItem>
          </Select>
          {errors.type && (
            <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>
              {errors.type.message}
            </p>
          )}
        </FormControl>
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

export default TxSearchForm;