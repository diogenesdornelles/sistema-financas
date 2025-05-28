import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { JSX, useEffect, useState } from 'react';
import { z } from 'zod';

import ErrorAlert from '@/components/alerts/ErrorAlert';
import ExcludeDialog from '@/components/dialogs/ExcludeDialog';
import CrSearchForm from '@/components/forms/search/crSearchForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import { useDeleteCr } from '@/hooks/service/cr/useDeleteCr';
import { useGetManyCr } from '@/hooks/service/cr/useGetManyCr';
import { useQueryCr } from '@/hooks/service/cr/useQueryCr';
import { useFormStore } from '@/hooks/useFormStore';
import { queryCrSchema, PaymentStatus, CrProps, strToPtBrMoney } from '@monorepo/packages';

type QueryCrFormData = z.infer<typeof queryCrSchema>;

const CrTable = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<CrProps[] | null>(null);
  const { isPending, error, data, isFetching, isRefetching, isLoading, refetch, isSuccess } = useGetManyCr(
    (page - 1) * SKIP,
  );
  const queryCrMutation = useQueryCr();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);
  const theme = useTheme();
  const delMutation = useDeleteCr();

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

  const onEdit = (item: CrProps) => {
    setFormType('cr', 'update');
    setIsOpen(true, 'cr');
    setUpdateItem('cr', {
      ...item,
      type: item.type.id,
      customer: item.customer.id,
      value: String(item.value),
      due: item.due ? String(item.due) : '',
      obs: item.obs ? item.obs : '',
    });
  };

  const handleSearch = (data: QueryCrFormData) => {
    queryCrMutation.mutate(data);
  };

  const handleClearSearch = async () => {
    queryCrMutation.reset();
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
      queryCrMutation.reset();
      await refetch();
    }
  };

  const handleChangePage = (direction: number) => {
    setPage((prev) => {
      const nextPage = prev + direction;
      if (nextPage < 1) return prev;
      if (direction > 0 && (!data || data.length === 0) && (!queryCrMutation.data || queryCrMutation.data.length === 0))
        return prev;
      return nextPage;
    });
  };

  useEffect(() => {
    if (queryCrMutation.data && queryCrMutation.data.length > 0) {
      setItems(queryCrMutation.data);
      return;
    } else if (data && data.length > 0) {
      setItems(data);
      return;
    } else if (!isPending && !isLoading && !isFetching && !queryCrMutation.isPending) {
      setItems(null);
      return;
    } else if (!queryCrMutation.data && !data) {
      setItems(null);
      return;
    } else {
      setItems(null);
      return;
    }
  }, [
    queryCrMutation.data,
    data,
    queryCrMutation.isSuccess,
    queryCrMutation.isPending,
    isSuccess,
    isPending,
    isLoading,
    isFetching,
  ]);

  if (error) return <ErrorAlert message={error.message} />;

  if (queryCrMutation.isError) return <ErrorAlert message={queryCrMutation.error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(isPending || isLoading || isFetching || isRefetching || delMutation.isPending || queryCrMutation.isPending) && (
        <CustomBackdrop isOpen={true} />
      )}

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Typography variant="h5">Filtro</Typography>
        <CrSearchForm onSearch={handleSearch} onClear={handleClearSearch} />
      </Box>
      <Divider />
      <Typography variant="h5">Contas a receber</Typography>
      <TableContainer component={Paper} sx={{ flex: 1, minHeight: '30vh', maxHeight: '50vh', overflow: 'scroll' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: 800 }}>
                ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 800 }}>
                Valor
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Tipo
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Cliente
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Vencimento
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Observação
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Status
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Criado em
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Atualizado em
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items && items.length > 0 ? (
              items.map((item: CrProps, i: number) => (
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
                  <TableCell scope="row" align="left" sx={{ fontWeight: 900 }}>
                    {item.id}
                  </TableCell>
                  <TableCell align="left">R$ {strToPtBrMoney(String(item.value))}</TableCell>
                  <TableCell align="right">{item.type.name}</TableCell>
                  <TableCell align="right">{item.customer.name}</TableCell>
                  <TableCell align="right">{new Date(item.due + 'T00:00:00').toLocaleDateString()}</TableCell>
                  <TableCell align="right">{item.obs || '-'}</TableCell>
                  <TableCell align="right">{getPaymentStatusText(item.status)}</TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={20} align="center">
                  Nenhuma conta a receber encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {items && items.length > 0 && (
        <Box
          sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', flex: 0.1 }}
        >
          <ButtonGroup variant="contained" aria-label="basic button group">
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

export default CrTable;
