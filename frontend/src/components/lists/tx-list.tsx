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
import { TxProps } from '../../../../packages/dtos/tx.dto';
import { useDeleteTx, useGetManyTx, useQueryTx } from '../../hooks/use-tx';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles';
import TxSearchForm from '../forms/search/tx-search-form';
import { queryTxSchema } from '../../../../packages/validators/zod-schemas/query/query-tx.validator';
import { z } from 'zod';
import { TransactionType } from '../../../../packages/dtos/utils/enums';

type QueryTxFormData = z.infer<typeof queryTxSchema>;

const TxList = (): JSX.Element | string => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<TxProps[] | null>(null);
  const { isPending, error, data } = useGetManyTx((page - 1) * SKIP);
  const queryTxMutation = useQueryTx();
  const { setFormType, setUpdateItem } = useFormStore();
  const theme = useTheme();

  const onEdit = (item: TxProps) => {
    setFormType('tx', 'update');
    setUpdateItem('tx', {
      ...item,
      cf: item.cf.id,
      category: item.category.id,
      value: String(item.value),
      tdate: item.tdate ? item.tdate.toISOString().split('T')[0] : '',
    });
  };

  const delMutation = useDeleteTx();

  const handleSearch = (data: QueryTxFormData) => {
    queryTxMutation.mutate(data);
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

  useEffect(() => {
    if (queryTxMutation.data) {
      setItems(queryTxMutation.data);
    } else if (data) {
      setItems(data);
    }
  }, [queryTxMutation.data, data]);

  if (isPending) return 'Carregando...';
  if (error) return <ErrorAlert message={error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      <Typography variant="h4">Filtro</Typography>
      <TxSearchForm onSearch={handleSearch} />
      <Divider />
      <Typography variant="h4">Transações</Typography>
      <List sx={{ flex: 1, width: '100%', maxHeight: 400, overflow: 'auto' }}>
        {items &&
          items.map((item: TxProps, i: number) => (
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
                <Chip label={`Conta: ${item.cf.number}`} variant="outlined" size="small" />
                <Chip
                  label={`Tipo: ${item.type === TransactionType.ENTRY ? 'Entrada' : 'Saída'}`}
                  color={item.type === TransactionType.ENTRY ? 'success' : 'error'}
                  variant="outlined"
                  size="small"
                />
                <Chip label={`Valor: R$ ${item.value}`} variant="outlined" size="small" />
                <Chip label={`Categoria: ${item.category.name}`} variant="outlined" size="small" />
                <Chip label={`Descrição: ${item.description}`} variant="outlined" size="small" />
                <Chip
                  label={`Status: ${item.status ? 'Ativo' : 'Inativo'}`}
                  color={item.status ? 'primary' : 'error'}
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

export default TxList;