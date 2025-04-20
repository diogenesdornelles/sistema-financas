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
import { CpProps } from '../../../../packages/dtos/cp.dto';
import { useDeleteCp, useGetManyCp, useQueryCp } from '../../hooks/use-cp';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles';
import CpSearchForm from '../forms/search/cp-search-form';
import { queryCpSchema } from '../../../../packages/validators/zod-schemas/query/query-cp.validator';
import { z } from 'zod';
import { strToPtBrMoney } from '../../utils/strToPtBrMoney';
import CustomBackdrop from '../custom-backdrop';
import { PaymentStatus } from '../../../../packages/dtos/utils/enums';
import ExcludeDialog from '../dialogs/exclude-dialog';

type QueryCpFormData = z.infer<typeof queryCpSchema>;

const CpTable = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<CpProps[] | null>(null);
  const { isPending,
    error,
    data,
    isFetching,
    isRefetching,
    isLoading,
    refetch,
    isSuccess } = useGetManyCp((page - 1) * SKIP);
  const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);
  const queryCpMutation = useQueryCp();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const theme = useTheme();
  const delMutation = useDeleteCp();

  const onEdit = (item: CpProps) => {
    setFormType('cp', 'update');
    setIsOpen(true, 'cp')
    setUpdateItem('cp', {
      ...item,
      type: item.type.id,
      supplier: item.supplier.id,
      value: String(item.value),
      due: String(item.due),
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

  const handleSearch = (data: QueryCpFormData) => {
    queryCpMutation.mutate(data);
  };

  const handleClearSearch = async () => {
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
      refetch();
    }
  };

  const handleChangePage = (direction: number) => {
    setPage((prev) => {
      const nextPage = prev + direction;
      if (nextPage < 1) return prev;
      if (direction > 0 && ((!data || data.length === 0) && (!queryCpMutation.data || queryCpMutation.data.length === 0))) return prev;
      return nextPage;
    });
  };

  useEffect(() => {
    if (queryCpMutation.isSuccess && queryCpMutation.data) {
      setItems(queryCpMutation.data);
    } else if (isSuccess && data) {
      setItems(data);
    } else if (!isPending && !isLoading && !isFetching && !queryCpMutation.isPending) {
      setItems(null);
    }
  }, [queryCpMutation.data, data, queryCpMutation.isSuccess, queryCpMutation.isPending, isSuccess, isPending, isLoading, isFetching]);


  if (error) return <ErrorAlert message={error.message} />;

  if (queryCpMutation.isError) return <ErrorAlert message={queryCpMutation.error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(isPending || isLoading || isFetching || isRefetching || delMutation.isPending || queryCpMutation.isPending) && <CustomBackdrop isOpen={true} />}

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Typography variant="h5">Filtro</Typography>
        <CpSearchForm onSearch={handleSearch} onClear={handleClearSearch} />
      </Box>
      <Divider />
      <Typography variant="h5">Contas a pagar</Typography>
      <TableContainer component={Paper} sx={{ flex: 1, minHeight: '30vh', maxHeight: '50vh', overflow: 'scroll' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={{ fontWeight: 800 }}>ID</TableCell>
              <TableCell align='left' sx={{ fontWeight: 800 }}>Valor</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Tipo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Fornecedor</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Vencimento</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Observações</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Criado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Atualizado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items &&
              items.map((item: CpProps, i: number) => (
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
                  <TableCell align='left'>R$ {strToPtBrMoney(String(item.value))}</TableCell>
                  <TableCell align="right">{item.type.name}</TableCell>
                  <TableCell align="right">{item.supplier.name}</TableCell>
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

export default CpTable;
