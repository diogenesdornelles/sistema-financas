import { JSX, useEffect, useState } from 'react';
import {
  IconButton,
  Box,
  Typography,
  ButtonGroup,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
import { strToPtBrMoney } from '../../utils/strToPtBrMoney';
import CustomBackdrop from '../custom-backdrop';

type QueryTxFormData = z.infer<typeof queryTxSchema>;

const TxList = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<TxProps[] | null>(null);
  const { isPending, error, data } = useGetManyTx((page - 1) * SKIP);
  const queryTxMutation = useQueryTx();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const theme = useTheme();

  const onEdit = (item: TxProps) => {
    setFormType('tx', 'update');
    setIsOpen(true, 'tx')
    setUpdateItem('tx', {
      ...item,
      value: item.value ? String(item.value) : '',
      cr: item.cr ? item.cr.id : undefined,
      cp: item.cp ? item.cp.id : undefined,
      cf: item.cf ? item.cf.id : undefined,
      description: item.description ? item.description : '',
      category: item.category ? item.category.id : undefined,
      obs: item.obs ? item.obs : undefined,
      status: item.status,
      tdate: item.tdate ? String(item.tdate) : '',
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

  if (error) return <ErrorAlert message={error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(isPending) && <CustomBackdrop isOpen={isPending} />}
      <Typography variant="h4">Filtro</Typography>
      <TxSearchForm onSearch={handleSearch} />
      <Divider />
      <Typography variant="h4">Transações</Typography>
      <TableContainer component={Paper} sx={{ height: '100%' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="tabela de transações">
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={{ fontWeight: 800 }}>ID</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Valor</TableCell>
              <TableCell align='left' sx={{ fontWeight: 800 }}>Tipo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Conta Financeira</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>ID Conta a pagar</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>ID Conta a receber</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Descrição</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Categoria</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Obs</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Data</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Criado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Atualizado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items &&
              items.map((item: TxProps, i: number) => (
                <TableRow
                  key={item.id}
                  sx={{
                    background:
                      i % 2 === 0
                        ? theme.palette.mode === 'light'
                          ? theme.palette.grey[50]
                          : theme.palette.grey[900]
                        : theme.palette.mode === 'light'
                          ? theme.palette.common.white
                          : theme.palette.common.black,
                  }}
                >
                  <TableCell scope="row" align='left' sx={{ fontWeight: 900 }}>
                    {item.id}
                  </TableCell>
                  <TableCell align="right">R$ {strToPtBrMoney(String(item.value))}</TableCell>
                  <TableCell align='left'>
                    {item.cr ? 'Entrada' : 'Saída'}
                  </TableCell>
                  <TableCell align="right">{item.cf.number}</TableCell>
                  <TableCell align="right">{item.cp ? item.cp.id : '-'}</TableCell>
                  <TableCell align="right">{item.cr ? item.cr.id : '-'}</TableCell>
                  <TableCell align="right">{item.description}</TableCell>
                  <TableCell align="right">{item.category.name}</TableCell>
                  <TableCell align="right">{item.obs || '-'}</TableCell>
                  <TableCell align="right">{item.status ? 'Ativo' : 'Inativo'}</TableCell>
                  <TableCell align="right">{item.tdate ? new Date(item.tdate).toLocaleDateString() : '-'}</TableCell>
                  <TableCell align="right">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton edge="end" aria-label="edit" onClick={() => onEdit(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data && data.length > 0 && (
        <ButtonGroup
          variant="contained"
          aria-label="basic button group"
          sx={{ display: 'flex', marginBottom: 2, flex: 0, width: 'fit-content', height: '100%', alignSelf: 'center' }}
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
