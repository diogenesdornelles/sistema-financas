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

type QueryUserFormData = z.infer<typeof queryUserSchema>;

const UserList = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<UserProps[] | null>(null);
  const { isPending, error, data } = useGetManyUser((page - 1) * SKIP);
  const queryUserMutation = useQueryUser();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const theme = useTheme();

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

  const delMutation = useDeleteUser();

  const handleSearch = (data: QueryUserFormData) => {
    queryUserMutation.mutate(data);
  };

  const handleClearSearch = () => {
    setItems(data || null);
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
    if (queryUserMutation.data) {
      setItems(queryUserMutation.data);
    } else if (data) {
      setItems(data);
    }
  }, [queryUserMutation.data, data]);

  if (error) return <ErrorAlert message={error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(isPending) && <CustomBackdrop isOpen={isPending} />}
      <Typography variant="h4">Filtro</Typography>
      <UserSearchForm onSearch={handleSearch} onClear={handleClearSearch}/>
      <Divider />
      <Typography variant="h4">Usuários</Typography>
      <TableContainer component={Paper} sx={{ height: '100%' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="tabela de usuários">
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

export default UserList;
