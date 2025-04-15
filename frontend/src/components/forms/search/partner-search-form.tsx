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
import { queryPartnerSchema } from '../../../../../packages/validators/zod-schemas/query/query-partner.validator';
import { JSX } from 'react';
import { PartnerSearchType } from '../../../../../packages/dtos/utils/enums';

type QueryPartnerFormData = z.infer<typeof queryPartnerSchema>;

interface PartnerSearchFormProps {
  onSearch: (data: QueryPartnerFormData) => void;
  onClear: () => void;
}

const PartnerSearchForm = ({ onSearch, onClear }: PartnerSearchFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<QueryPartnerFormData>({
    resolver: zodResolver(queryPartnerSchema),
    defaultValues: {
      name: '',
      cod: '',
      type: PartnerSearchType.PFPJ,
      status: false, // não mostrar inativos
      obs: '',
      createdAt: '',
      updatedAt: '',
      id: ''
    },
  });

  const showInactives = watch('status');

  const onSubmit = (data: QueryPartnerFormData) => {
    const cleanedData: Partial<QueryPartnerFormData> = { ...data };
    (['id', 'name', 'cod', 'obs', 'createdAt', 'updatedAt', 'type'] as const).forEach((key) => {
      if (!cleanedData[key]) {
        delete cleanedData[key];
      }
    });
    onSearch(cleanedData);
    reset()
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
          label="Nome"
          {...register('name')}
          variant="outlined"
          error={!!errors.name}
          helperText={errors.name?.message}
          size="small"
        />
        <TextField
          label="Código (CPF/CNPJ)"
          {...register('cod')}
          variant="outlined"
          error={!!errors.cod}
          helperText={errors.cod?.message}
          size="small"
        />
        <FormControl variant="outlined" error={!!errors.type}>
          <InputLabel id="partner-type-label-search" size='small'>Tipo</InputLabel>
          <Select
            sx={{ width: 100 }}
            labelId="partner-type-label-search"
            label="Tipo"
            size="small"
            defaultValue={PartnerSearchType.PFPJ}
            {...register("type")}
          >
            <MenuItem value="PF">PF</MenuItem>
            <MenuItem value="PJ">PJ</MenuItem>
            <MenuItem value="PFPJ">Ambos</MenuItem>
          </Select>
          {errors.type && (
            <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>
              {errors.type.message}
            </p>
          )}
        </FormControl>
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

export default PartnerSearchForm;