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
import TcpSearchForm from '@/components/forms/search/tcpSearchForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import { useDeleteTcp } from '@/hooks/service/tcp/useDeleteTcp';
import { useGetManyTcp } from '@/hooks/service/tcp/useGetManyTcp';
import { useQueryTcp } from '@/hooks/service/tcp/useQueryTcp';
import { useFormStore } from '@/hooks/useFormStore';
import type { queryTcpSchema, TcpProps } from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';

type QueryTcpFormData = z.infer<typeof queryTcpSchema>;

const TcpTable = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<TcpProps[] | null>(null);
  const { isPending, error, data, isFetching, isRefetching, isLoading, refetch, isSuccess } = useGetManyTcp(
    (page - 1) * SKIP,
  );
  const queryTcpMutation = useQueryTcp();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);
  const theme = useTheme();
  const delMutation = useDeleteTcp();

  const onEdit = (item: TcpProps) => {
    setFormType('tcp', 'update');
    setIsOpen(true, 'tcp');
    setUpdateItem('tcp', {
      ...item,
      name: item.name,
      status: item.status ? item.status : undefined,
    });
  };

  const handleSearch = (data: QueryTcpFormData) => {
    queryTcpMutation.mutate(data);
  };

  const handleClearSearch = async () => {
    queryTcpMutation.reset();
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
      queryTcpMutation.reset();
      await refetch();
    }
  };

  const handleChangePage = (direction: number) => {
    setPage((prev) => {
      const nextPage = prev + direction;
      if (nextPage < 1) return prev;
      if (
        direction > 0 &&
        (!data || data.length === 0) &&
        (!queryTcpMutation.data || queryTcpMutation.data.length === 0)
      )
        return prev;
      return nextPage;
    });
  };

  useEffect(() => {
    if (queryTcpMutation.data && queryTcpMutation.data.length > 0) {
      setItems(queryTcpMutation.data);
      return;
    } else if (data && data.length > 0) {
      setItems(data);
      return;
    } else if (!isPending && !isLoading && !isFetching && !queryTcpMutation.isPending) {
      setItems(null);
      return;
    } else if (!queryTcpMutation.data && !data) {
      setItems(null);
      return;
    } else {
      setItems(null);
      return;
    }
  }, [
    queryTcpMutation.data,
    data,
    queryTcpMutation.isSuccess,
    queryTcpMutation.isPending,
    isSuccess,
    isPending,
    isLoading,
    isFetching,
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(error || queryTcpMutation.isError) && (
        <ToastAlert severity="error" title="Erro" message={'Erro ao obter dados.'} open />
      )}
      {(isPending ||
        isLoading ||
        isFetching ||
        isRefetching ||
        delMutation.isPending ||
        queryTcpMutation.isPending) && <CustomBackdrop isOpen={true} />}

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Typography variant="h5">Filtro</Typography>
        <TcpSearchForm onSearch={handleSearch} onClear={handleClearSearch} />
      </Box>
      <Divider />
      <Typography variant="h5">Tipos de contas a pagar</Typography>
      <TableContainer component={Paper} sx={{ flex: 1, minHeight: '30vh', maxHeight: '50vh', overflow: 'scroll' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: 800 }}>
                ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 800 }}>
                Nome
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
              items.map((item: TcpProps, i: number) => (
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
                  <TableCell align="left">{item.name}</TableCell>
                  <TableCell align="right">{item.status ? 'Ativo' : 'Inativo'}</TableCell>
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
                  Nenhum tipo de conta a pagar encontrado.
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

export default TcpTable;
