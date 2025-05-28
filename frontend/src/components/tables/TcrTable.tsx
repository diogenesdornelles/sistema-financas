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
import TcrSearchForm from '@/components/forms/search/tcrSearchForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import { useDeleteTcr } from '@/hooks/service/tcr/useDeleteTcr';
import { useGetManyTcr } from '@/hooks/service/tcr/useGetManyTcr';
import { useQueryTcr } from '@/hooks/service/tcr/useQueryTcr';
import { useFormStore } from '@/hooks/useFormStore';
import { TcrProps } from '@packages/src/src/dtos/tcr.dto';
import { queryTcrSchema } from '@monorepo/packages';

type QueryTcrFormData = z.infer<typeof queryTcrSchema>;

const TcrTable = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<TcrProps[] | null>(null);
  const { isPending, error, data, isFetching, isRefetching, isLoading, refetch, isSuccess } = useGetManyTcr(
    (page - 1) * SKIP,
  );
  const queryTcrMutation = useQueryTcr();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);
  const theme = useTheme();
  const delMutation = useDeleteTcr();

  const onEdit = (item: TcrProps) => {
    setFormType('tcr', 'update');
    setIsOpen(true, 'tcr');
    setUpdateItem('tcr', {
      ...item,
      name: item.name,
      status: item.status ? item.status : undefined,
    });
  };

  const handleSearch = (data: QueryTcrFormData) => {
    queryTcrMutation.mutate(data);
  };

  const handleClearSearch = async () => {
    queryTcrMutation.reset();
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
      queryTcrMutation.reset();
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
        (!queryTcrMutation.data || queryTcrMutation.data.length === 0)
      )
        return prev;
      return nextPage;
    });
  };

  useEffect(() => {
    if (queryTcrMutation.data && queryTcrMutation.data.length > 0) {
      setItems(queryTcrMutation.data);
      return;
    } else if (data && data.length > 0) {
      setItems(data);
      return;
    } else if (!isPending && !isLoading && !isFetching && !queryTcrMutation.isPending) {
      setItems(null);
      return;
    } else if (!queryTcrMutation.data && !data) {
      setItems(null);
      return;
    } else {
      setItems(null);
      return;
    }
  }, [
    queryTcrMutation.data,
    data,
    queryTcrMutation.isSuccess,
    queryTcrMutation.isPending,
    isSuccess,
    isPending,
    isLoading,
    isFetching,
  ]);

  if (error) return <ErrorAlert message={error.message} />;

  if (queryTcrMutation.isError) return <ErrorAlert message={queryTcrMutation.error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(isPending ||
        isLoading ||
        isFetching ||
        isRefetching ||
        delMutation.isPending ||
        queryTcrMutation.isPending) && <CustomBackdrop isOpen={true} />}

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Typography variant="h5">Filtro</Typography>
        <TcrSearchForm onSearch={handleSearch} onClear={handleClearSearch} />
      </Box>
      <Divider />
      <Typography variant="h5">Tipos de contas a receber</Typography>
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
              items.map((item: TcrProps, i: number) => (
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
                  Nenhum tipo de conta a receber encontrado.
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

export default TcrTable;
