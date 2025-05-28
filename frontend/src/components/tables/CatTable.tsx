import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, ButtonGroup, Divider, IconButton, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { JSX, useEffect, useState } from 'react';
import { z } from 'zod';

import ErrorAlert from '@/components/alerts/ErrorAlert';
import ExcludeDialog from '@/components/dialogs/ExcludeDialog';
import CatSearchForm from '@/components/forms/search/catSearchForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import { useDeleteCat } from '@/hooks/service/cat/useDeleteCat';
import { useGetManyCat } from '@/hooks/service/cat/useGetManyCat';
import { useQueryCat } from '@/hooks/service/cat/useQueryCat';
import { useFormStore } from '@/hooks/useFormStore';
import { queryCatSchema, CatProps } from '@monorepo/packages';

type QueryCatFormData = z.infer<typeof queryCatSchema>;

const CatTable = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const { isPending, error, data, isFetching, isRefetching, isLoading, refetch, isSuccess } = useGetManyCat(
    (page - 1) * SKIP,
  );
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const theme = useTheme();
  const [items, setItems] = useState<CatProps[] | null>(null);
  const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);
  const queryCatMutation = useQueryCat();
  const delMutation = useDeleteCat();

  const onEdit = (item: CatProps) => {
    setFormType('cat', 'update');
    setIsOpen(true, 'cat');
    setUpdateItem('cat', {
      ...item,
      name: item.name,
      obs: item.obs,
      description: item.description,
      status: item.status,
    });
  };

  const handleSearch = (data: QueryCatFormData) => {
    queryCatMutation.mutate(data);
  };

  const handleClearSearch = async () => {
    queryCatMutation.reset();
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
      queryCatMutation.reset();
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
        (!queryCatMutation.data || queryCatMutation.data.length === 0)
      )
        return prev;
      return nextPage;
    });
  };

  useEffect(() => {
    if (queryCatMutation.data && queryCatMutation.data.length > 0) {
      setItems(queryCatMutation.data);
      return;
    } else if (data && data.length > 0) {
      setItems(data);
      return;
    } else if (!isPending && !isLoading && !isFetching && !queryCatMutation.isPending) {
      setItems(null);
      return;
    } else if (!queryCatMutation.data && !data) {
      setItems(null);
      return;
    } else {
      setItems(null);
      return;
    }
  }, [
    queryCatMutation.data,
    data,
    queryCatMutation.isSuccess,
    queryCatMutation.isPending,
    isSuccess,
    isPending,
    isLoading,
    isFetching,
  ]);

  if (error) return <ErrorAlert message={error.message} />;

  if (queryCatMutation.isError) return <ErrorAlert message={queryCatMutation.error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(isPending ||
        isLoading ||
        isFetching ||
        isRefetching ||
        delMutation.isPending ||
        queryCatMutation.isPending) && <CustomBackdrop isOpen={true} />}
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Typography variant="h5">Filtro</Typography>
        <CatSearchForm onSearch={handleSearch} onClear={handleClearSearch} />
      </Box>
      <Divider />
      <Typography variant="h5">Categorias</Typography>
      <TableContainer component={Paper} sx={{ flex: 1, minHeight: '30vh', maxHeight: '50vh', overflow: 'scroll' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell scope="col" align="left" sx={{ fontWeight: 800 }}>
                ID
              </TableCell>
              <TableCell scope="col" align="left" sx={{ fontWeight: 800 }}>
                Nome
              </TableCell>
              <TableCell scope="col" align="right" sx={{ fontWeight: 800 }}>
                Status
              </TableCell>
              <TableCell scope="col" align="right" sx={{ fontWeight: 800 }}>
                Descrição
              </TableCell>
              <TableCell scope="col" align="right" sx={{ fontWeight: 800 }}>
                Observação
              </TableCell>
              <TableCell scope="col" align="right" sx={{ fontWeight: 800 }}>
                Criado em
              </TableCell>
              <TableCell scope="col" align="right" sx={{ fontWeight: 800 }}>
                Atualizado em
              </TableCell>
              <TableCell scope="col" align="right" sx={{ fontWeight: 800 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items && items.length > 0 ? (
              items.map((item: CatProps, i: number) => (
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
                  <TableCell align="left" sx={{ fontWeight: 900 }}>
                    {item.id}
                  </TableCell>
                  <TableCell align="left">{item.name}</TableCell>
                  <TableCell align="right">{`${item.status ? 'Ativo' : 'Inativo'}`}</TableCell>
                  <TableCell align="right">{item.description || '-'}</TableCell>
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
                  Nenhuma categoria encontrada.
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

export default CatTable;
