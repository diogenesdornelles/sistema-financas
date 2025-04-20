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
import { UserProps } from '../../../../packages/dtos/user.dto';
import { useDeleteUser, useGetManyUser, useQueryUser } from '../../hooks/use-user';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles';
import UserSearchForm from '../forms/search/user-search-form';
import { queryUserSchema } from '../../../../packages/validators/zod-schemas/query/query-user.validator';
import { z } from 'zod';
import CustomBackdrop from '../custom-backdrop';
import ExcludeDialog from '../dialogs/exclude-dialog';

type QueryUserFormData = z.infer<typeof queryUserSchema>;

const UserTable = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<UserProps[] | null>(null);
  const { isPending,
    error,
    data,
    isFetching,
    isRefetching,
    isLoading,
    refetch,
    isSuccess } = useGetManyUser((page - 1) * SKIP);
  const queryUserMutation = useQueryUser();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);
  const theme = useTheme();
  const delMutation = useDeleteUser();

  const onEdit = (item: UserProps) => {
    setFormType('user', 'update');
    setIsOpen(true, 'user')
    setUpdateItem('user', {
      ...item,
      name: item.name,
      surname: item.surname,
      cpf: item.cpf,
      status: item.status,
    });
  };

  const handleSearch = (data: QueryUserFormData) => {
    queryUserMutation.mutate(data);
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
      if (direction > 0 && ((!data || data.length === 0) && (!queryUserMutation.data || queryUserMutation.data.length === 0))) return prev;
      return nextPage;
    });
  };

  useEffect(() => {
    if (queryUserMutation.isSuccess && queryUserMutation.data) {
      setItems(queryUserMutation.data);
    } else if (isSuccess && data) {
      setItems(data);
    } else if (!isPending && !isLoading && !isFetching && !queryUserMutation.isPending) {
      setItems(null);
    }
  }, [queryUserMutation.data, data, queryUserMutation.isSuccess, queryUserMutation.isPending, isSuccess, isPending, isLoading, isFetching]);


  if (error) return <ErrorAlert message={error.message} />;

  if (queryUserMutation.isError) return <ErrorAlert message={queryUserMutation.error.message} />;


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(isPending || isLoading || isFetching || isRefetching || delMutation.isPending || queryUserMutation.isPending) && <CustomBackdrop isOpen={true} />}

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Typography variant="h5">Filtro</Typography>
        <UserSearchForm onSearch={handleSearch} onClear={handleClearSearch} />
      </Box>
      <Divider />
      <Typography variant="h5">Usuários</Typography>
      <TableContainer component={Paper} sx={{ flex: 1, minHeight: '30vh', maxHeight: '50vh', overflow: 'scroll' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={{ fontWeight: 800 }}>ID</TableCell>
              <TableCell align='left' sx={{ fontWeight: 800 }}>Nome</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Sobrenome</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>CPF</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Criado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Atualizado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items &&
              items.map((item: UserProps, i: number) => (
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
                  <TableCell align='left'>{item.name}</TableCell>
                  <TableCell align="right">{item.surname}</TableCell>
                  <TableCell align="right">{item.cpf}</TableCell>
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

export default UserTable;
