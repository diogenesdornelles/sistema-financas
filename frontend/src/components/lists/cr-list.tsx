import { JSX, useEffect, useState } from 'react';
import {
  List,
  ListItem,
  IconButton,
  Box,
  Chip,
  Typography,
  ButtonGroup,
  Button,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CrProps } from '../../../../packages/dtos/cr.dto';
import { useDeleteCr, useGetManyCr, useQueryCr } from '../../hooks/use-cr';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles';
import CrSearchForm from '../forms/search/cr-search-form';
import { queryCrSchema } from '../../../../packages/validators/zod-schemas/query/query-cr.validator';
import { z } from 'zod';
import { PaymentStatus } from '../../../../packages/dtos/utils/enums';

type QueryCrFormData = z.infer<typeof queryCrSchema>;

const CrList = (): JSX.Element | string => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<CrProps[] | null>(null);
  const { isPending, error, data } = useGetManyCr((page - 1) * SKIP);
  const queryCrMutation = useQueryCr();
  const { setFormType, setUpdateItem } = useFormStore();
  const theme = useTheme();
  const onEdit = (item: CrProps) => {
    setFormType('cr', 'update');
    setUpdateItem('cr', {
      ...item,
      type: item.type.id,
      customer: item.customer.id,
      tx: item.tx ? item.tx.id : undefined,
      value: String(item.value),
      due: item.due.toISOString().split('T')[0],
      rdate: item.rdate ? item.rdate.toISOString().split('T')[0] : undefined,
    });
  };

  const delMutation = useDeleteCr();

  const handleSearch = (data: QueryCrFormData) => {
    queryCrMutation.mutate(data);
  };

  const onDelete = async (id: string) => {
    if (confirm('Deseja deletar?')) {
      try {
        await delMutation.mutateAsync(id);
      } catch (err) {
        console.error('Erro ao deletar o item:', err);
      }
    }
  };

  const handleChangePage = (direction: number) => {
    setPage((prev) => {
      const nextPage = prev + direction;
      if (nextPage < 1) return prev;
      if (direction > 0 && (!data || data.length === 0)) return prev;

      return nextPage;
    });
  };

  const getPaymentStatusText = (status: PaymentStatus): string => {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'Pendente';
      case PaymentStatus.PAID:
        return 'Pago';
      case PaymentStatus.CANCELLED:
        return 'Cancelado';
      default:
        return status;
    }
  };

  useEffect(() => {
    if (queryCrMutation.data) {
      setItems(queryCrMutation.data);
    } else if (data) {
      setItems(data);
    }
  }, [queryCrMutation.data, data]);

  if (isPending) return 'Carregando...';
  if (error) return <ErrorAlert message={error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      <Typography variant="h4">Filtro</Typography>
      <CrSearchForm onSearch={handleSearch} />
      <Divider />
      <Typography variant="h4">Contas a receber</Typography>
      <List sx={{ flex: 1, width: '100%', maxHeight: 400, overflow: 'auto' }}>
        {items &&
          items.map((item: CrProps, i: number) => (
            <ListItem
              key={item.id}
              divider
              sx={{
                display: 'flex',
                p: 2,
                justifyContent: 'space-between',
                alignItems: 'center',
                background: i % 2 === 0
                  ? theme.palette.mode === 'light'
                    ? theme.palette.grey[50]
                    : theme.palette.grey[900]
                  : theme.palette.mode === 'light'
                  ? theme.palette.common.white
                  : theme.palette.common.black,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap', alignItems: 'baseline' }}>
                <Chip label={`Valor: R$ ${item.value}`} variant="outlined" size="small" />
                <Chip label={`Tipo: ${item.type.name}`} variant="outlined" size="small" />
                <Chip label={`Cliente: ${item.customer.name}`} variant="outlined" size="small" />
                <Chip label={`Vencimento: ${new Date(item.due).toLocaleDateString()}`} variant="outlined" size="small" />
                {item.rdate && (
                  <Chip label={`Recebido em: ${new Date(item.rdate).toLocaleDateString()}`} variant="outlined" size="small" />
                )}
                <Chip
                  label={`Status: ${getPaymentStatusText(item.status)}`}
                  color={item.status === PaymentStatus.PAID ? 'primary' : 'error'}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`Criado em: ${new Date(item.createdAt).toLocaleDateString()}`}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`Atualizado em: ${new Date(item.updatedAt).toLocaleDateString()}`}
                  variant="outlined"
                  size="small"
                />
                {item.obs && <Chip label={`Obs: ${item.obs}`} variant="outlined" size="small" />}
                {item.tx && <Chip label={`Transação: ${item.tx.id}`} variant="outlined" size="small" />}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton edge="end" aria-label="edit" onClick={() => onEdit(item)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
      </List>
      {data && data.length > 0 && (
        <ButtonGroup
          variant="contained"
          aria-label="Basic button group"
          sx={{ marginBottom: 2, flex: 0, width: 'fit-content', alignSelf: 'center' }}
        >
          <Button onClick={() => handleChangePage(-1)} disabled={page === 1}>
            Anterior
          </Button>
          <Button onClick={() => handleChangePage(1)} disabled={!data || data.length === 0}>
            Próximo
          </Button>
        </ButtonGroup>
      )}
    </Box>
  );
};

export default CrList;