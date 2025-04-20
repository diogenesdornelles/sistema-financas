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
import ExcludeDialog from '../dialogs/exclude-dialog';

type QueryTxFormData = z.infer<typeof queryTxSchema>;

const TxTable = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<TxProps[] | null>(null);
  const { isPending,
    error,
    data,
    isFetching,
    isRefetching,
    isLoading,
    refetch,
    isSuccess } = useGetManyTx((page - 1) * SKIP);
  const queryTxMutation = useQueryTx();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);
  const theme = useTheme();
  const delMutation = useDeleteTx();

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

  const handleSearch = (data: QueryTxFormData) => {
    queryTxMutation.mutate(data);
  };

  const handleClearSearch = async () => {
    queryTxMutation.reset();
    setPage(1);
    setItems(data || null);
  };


  const handleOpenDeleteDialog = (id: string) => {
    setItemIdToDelete(id);
  };

  const handleCloseDeleteDialog = () => {
    setItemIdToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!itemIdToDelete) return;

    try {
      await delMutation.mutateAsync(itemIdToDelete);
    } catch (err) {
      console.error('Erro ao deletar o item:', err);
    } finally {
      handleCloseDeleteDialog();
      queryTxMutation.reset();
      await refetch();
    }
  };

  const handleChangePage = (direction: number) => {
    setPage((prev) => {
      const nextPage = prev + direction;
      if (nextPage < 1) return prev;
      if (direction > 0 && ((!data || data.length === 0) && (!queryTxMutation.data || queryTxMutation.data.length === 0))) return prev;
      return nextPage;
    });
  };

  useEffect(() => {
    if (queryTxMutation.data && queryTxMutation.data.length > 0) {
      setItems(queryTxMutation.data);
      return
    } else if (data && data.length > 0) {
      setItems(data);
      return
    } else if (!isPending && !isLoading && !isFetching && !queryTxMutation.isPending) {
      setItems(null);
      return
    } else if (!queryTxMutation.data && !data) {
      setItems(null);
      return
    } else {
      setItems(null)
      return
    }
  }, [queryTxMutation.data, data, queryTxMutation.isSuccess, queryTxMutation.isPending, isSuccess, isPending, isLoading, isFetching]);


  if (error) return <ErrorAlert message={error.message} />;

  if (queryTxMutation.isError) return <ErrorAlert message={queryTxMutation.error.message} />;


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(isPending || isLoading || isFetching || isRefetching || delMutation.isPending || queryTxMutation.isPending) && <CustomBackdrop isOpen={true} />}

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Typography variant="h5">Filtro</Typography>
        <TxSearchForm onSearch={handleSearch} onClear={handleClearSearch} />
      </Box>
      <Divider />
      <Typography variant="h5">Transações</Typography>
      <TableContainer component={Paper} sx={{ flex: 1, minHeight: '30vh', maxHeight: '50vh', overflow: 'scroll' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={{ fontWeight: 800 }}>ID</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Valor</TableCell>
              <TableCell align='left' sx={{ fontWeight: 800 }}>Tipo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Conta Financeira</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>ID Conta a pagar</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>ID Conta a receber</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Descrição</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Txegoria</TableCell>
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
                  hover
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
                  <TableCell align="right">{item.tdate ? new Date(item.tdate + 'T00:00:00').toLocaleDateString() : '-'}</TableCell>
                  <TableCell align="right">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton edge="end" aria-label="edit" onClick={() => onEdit(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {
        items && items.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', flex: 0.1 }}>
            <ButtonGroup
              variant="contained"
              aria-label="basic button group"
            >
              <Button onClick={() => handleChangePage(-1)} disabled={page === 1}>
                Anterior
              </Button>
              <Button onClick={() => handleChangePage(1)} disabled={!items || items.length === 0}>
                Próximo
              </Button>
            </ButtonGroup>
          </Box>
        )}
      {itemIdToDelete && (
        <ExcludeDialog
          open={!!itemIdToDelete}
          itemId={itemIdToDelete}
          onClose={handleCloseDeleteDialog}
          onConfirmDelete={handleDeleteConfirm}
        />
      )}
    </Box>
  );
};

export default TxTable;
