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

import ExcludeDialog from '@/components/dialogs/ExcludeDialog';
import CfSearchForm from '@/components/forms/search/cfSearchForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import { useDeleteCf } from '@/hooks/service/cf/useDeleteCf';
import { useGetManyCf } from '@/hooks/service/cf/useGetManyCf';
import { useQueryCf } from '@/hooks/service/cf/useQueryCf';
import { useFormStore } from '@/hooks/useFormStore';
import type { CfProps, queryCfSchema } from '@monorepo/packages';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { strToPtBrMoney } = packages;

type QueryCfFormData = z.infer<typeof queryCfSchema>;

const CfTable = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<CfProps[] | null>(null);
  const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);
  const { isPending, error, data, isFetching, isRefetching, isLoading, refetch, isSuccess } = useGetManyCf(
    (page - 1) * SKIP,
  );
  const queryCfMutation = useQueryCf();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const theme = useTheme();
  const delMutation = useDeleteCf();

  const onEdit = (item: CfProps) => {
    setFormType('cf', 'update');
    setIsOpen(true, 'cf');
    setUpdateItem('cf', {
      ...item,
      number: item.number,
      type: item.type.id,
      ag: item.ag || undefined,
      bank: item.bank || undefined,
      obs: item.obs || undefined,
      status: item.status,
    });
  };

  const handleSearch = (data: QueryCfFormData) => {
    queryCfMutation.mutate(data);
  };

  const handleClearSearch = async () => {
    queryCfMutation.reset();
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
      queryCfMutation.reset();
      await refetch();
    }
  };

  const handleChangePage = (direction: number) => {
    setPage((prev) => {
      const nextPage = prev + direction;
      if (nextPage < 1) return prev;
      if (direction > 0 && (!data || data.length === 0) && (!queryCfMutation.data || queryCfMutation.data.length === 0))
        return prev;
      return nextPage;
    });
  };

  useEffect(() => {
    if (queryCfMutation.data && queryCfMutation.data.length > 0) {
      setItems(queryCfMutation.data);
      return;
    } else if (data && data.length > 0) {
      setItems(data);
      return;
    } else if (!isPending && !isLoading && !isFetching && !queryCfMutation.isPending) {
      setItems(null);
      return;
    } else if (!queryCfMutation.data && !data) {
      setItems(null);
      return;
    } else {
      setItems(null);
      return;
    }
  }, [
    queryCfMutation.data,
    data,
    queryCfMutation.isSuccess,
    queryCfMutation.isPending,
    isSuccess,
    isPending,
    isLoading,
    isFetching,
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(error || queryCfMutation.isError) && (
        <ToastAlert severity="error" title="Erro" message={'Erro ao obter dados.'} open />
      )}
      {(isPending || isLoading || isFetching || isRefetching || delMutation.isPending || queryCfMutation.isPending) && (
        <CustomBackdrop isOpen={true} />
      )}
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Typography variant="h5">Filtro</Typography>
        <CfSearchForm onSearch={handleSearch} onClear={handleClearSearch} />
      </Box>
      <Divider />
      <Typography variant="h5" sx={{ marginTop: 0 }}>
        Contas financeiras
      </Typography>
      <TableContainer component={Paper} sx={{ flex: 1, minHeight: '30vh', maxHeight: '50vh', overflow: 'scroll' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: 800 }}>
                ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 800 }}>
                Número
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Agência
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Banco
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Status
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Tipo
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Saldo original
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Saldo Atual
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Observações
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
              items.map((item: CfProps, i: number) => (
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
                  <TableCell scope="row" align="left">
                    {item.number}
                  </TableCell>
                  <TableCell align="right">{item.ag || '-'}</TableCell>
                  <TableCell align="right">{item.bank || '-'}</TableCell>
                  <TableCell align="right">{item.status ? 'Ativo' : 'Inativo'}</TableCell>
                  <TableCell align="right">{item.type.name}</TableCell>
                  <TableCell align="right">R$ {strToPtBrMoney(String(item.firstBalance))}</TableCell>
                  <TableCell align="right">R$ {strToPtBrMoney(String(item.currentBalance))}</TableCell>
                  <TableCell align="right">{item.obs || '-'}</TableCell>
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
                  Nenhuma conta financeira encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', flex: 0.1 }}>
        <ButtonGroup variant="contained" aria-label="basic button group">
          <Button onClick={() => handleChangePage(-1)} disabled={page === 1}>
            Anterior
          </Button>
          <Button onClick={() => handleChangePage(1)} disabled={!items || items.length === 0}>
            Próximo
          </Button>
        </ButtonGroup>
      </Box>
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

export default CfTable;
