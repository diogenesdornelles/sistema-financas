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
import { queryPartnerSchema } from '../../../../../packages/validators/zod-schemas/query/query-partner.validator';
import { JSX } from 'react';

type QueryPartnerFormData = z.infer<typeof queryPartnerSchema>;

interface PartnerSearchFormProps {
  onSearch: (data: QueryPartnerFormData) => void;
}

const PartnerSearchForm = ({ onSearch }: PartnerSearchFormProps): JSX.Element => {
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
      type: undefined,
      status: undefined,
      obs: '',
      createdAt: '',
      updatedAt: '',
    },
  });

  const showInactives = watch('status');

  const onSubmit = (data: QueryPartnerFormData) => {
    const cleanedData: Partial<QueryPartnerFormData> = { ...data };
    (['name', 'cod', 'obs', 'createdAt', 'updatedAt'] as const).forEach((key) => {
      if (!cleanedData[key]) {
        delete cleanedData[key];
      }
    });
    onSearch(cleanedData);
  };

  const handleReset = () => {
    reset({
      name: '',
      cod: '',
      type: undefined,
      status: undefined,
      obs: '',
      createdAt: '',
      updatedAt: '',
    });
    onSearch({} as QueryPartnerFormData); // Envia filtro limpo
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
          label="Nome"
          {...register('name')}
          variant="outlined"
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Código (CPF/CNPJ)"
          {...register('cod')}
          variant="outlined"
          error={!!errors.cod}
          helperText={errors.cod?.message}
        />
        <TextField
          label="Tipo"
          {...register('type')}
          variant="outlined"
          error={!!errors.type}
          helperText={errors.type?.message}
        />
        <TextField
          label="Observações"
          {...register('obs')}
          variant="outlined"
          error={!!errors.obs}
          helperText={errors.obs?.message}
        />
        <TextField
          label="Criação"
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
          label="Alteração"
          {...register('updatedAt')}
          variant="outlined"
          type="date"
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
        <Button type="button" variant="outlined" color="secondary" onClick={handleReset}>
          Limpar
        </Button>
      </form>
    </Box>
  );
};

export default PartnerSearchForm;