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
import { CpProps } from '../../../../packages/dtos/cp.dto';
import { useDeleteCp, useGetManyCp, useQueryCp } from '../../hooks/use-cp';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles';
import CpSearchForm from '../forms/search/cp-search-form';
import { queryCpSchema } from '../../../../packages/validators/zod-schemas/query/query-cp.validator';
import { z } from 'zod';
import { strToPtBrMoney } from '../../utils/strToPtBrMoney';

type QueryCpFormData = z.infer<typeof queryCpSchema>;

const CpList = (): JSX.Element | string => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<CpProps[] | null>(null);
  const { isPending, error, data } = useGetManyCp((page - 1) * SKIP);
  const queryCpMutation = useQueryCp();
  const { setFormType, setUpdateItem } = useFormStore();
  const theme = useTheme();

  const onEdit = (item: CpProps) => {
    setFormType('cp', 'update');
    setUpdateItem('cp', {
      ...item,
      type: item.type.id,
      supplier: item.supplier.id,
      tx: item.tx ? item.tx.id : undefined,
      value: String(item.value),
      due: String(item.due),
      pdate: item.pdate ? String(item.pdate) : '',
    }
    );
  };

  const delMutation = useDeleteCp();

  const handleSearch = (data: QueryCpFormData) => {
    queryCpMutation.mutate(data);
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
    if (queryCpMutation.data) {
      setItems(queryCpMutation.data);
    } else if (data) {
      setItems(data);
    }
  }, [queryCpMutation.data, data]);

  if (isPending) return 'Carregando...';
  if (error) return <ErrorAlert message={error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      <Typography variant="h4">Filtro</Typography>
      <CpSearchForm onSearch={handleSearch} />
      <Divider />
      <Typography variant="h4">Contas a pagar</Typography>
      <List sx={{ flex: 1, width: '100%', maxHeight: 400, overflow: 'auto' }}>
        {items &&
          items.map((item: CpProps, i: number) => (
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
                <Chip label={`Valor: R$ ${strToPtBrMoney(String(item.value))}`} variant="filled" size="medium" color="error"  />
                <Chip label={`Tipo: ${item.type.name}`} variant="outlined" size="small" />
                <Chip label={`Fornecedor: ${item.supplier.name}`} variant="outlined" size="small" />
                <Chip label={`Vencimento: ${new Date(item.due).toLocaleDateString()}`} variant="outlined" size="small" />
                {item.pdate && (
                  <Chip label={`Pagamento: ${new Date(item.pdate).toLocaleDateString()}`} variant="outlined" size="small" />
                )}
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

export default CpList;