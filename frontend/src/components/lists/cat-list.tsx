import { JSX, useEffect, useState } from 'react';
import {
  IconButton,
  Box,
  Typography,
  ButtonGroup,
  Button,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CatProps } from '../../../../packages/dtos/cat.dto';
import { useDeleteCat, useGetManyCat, useQueryCat } from '../../hooks/use-cat';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles';
import { z } from 'zod';
import { queryCatSchema } from '../../../../packages/validators/zod-schemas/query/query-cat.validator';
import CatSearchForm from '../forms/search/cat-search-form';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CustomBackdrop from '../custom-backdrop';



type QueryCatFormData = z.infer<typeof queryCatSchema>;

const CatList = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const { isPending, error, data } = useGetManyCat((page - 1) * SKIP)
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const theme = useTheme();
  const [items, setItems] = useState<CatProps[] | null>(null);
  const queryCatMutation = useQueryCat();

  const onEdit = (item: CatProps) => {
    setFormType('cat', 'update');
    setIsOpen(true, 'cat')
    setUpdateItem('cat', {
      ...item,
      name: item.name,
      obs: item.obs,
      description: item.description,
      status: item.status
    });
  };

  const delMutation = useDeleteCat();

  const handleSearch = (data: QueryCatFormData) => {
    queryCatMutation.mutate(data);
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

      // Garante que a página não seja menor que 1
      if (nextPage < 1) return prev;

      // Garante que a próxima página só seja acessada se houver dados
      if (direction > 0 && (!data || data.length === 0)) return prev;

      return nextPage;
    });
  };

  useEffect(() => {
    if (queryCatMutation.data) {
      setItems(queryCatMutation.data);
    } else if (data) {
      setItems(data);
    }
  }, [queryCatMutation.data, data]);

  if (error) return <ErrorAlert message={error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>

      {(isPending) && <CustomBackdrop isOpen={isPending} />}
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Typography variant="h5">Filtro</Typography>
        <CatSearchForm onSearch={handleSearch} onClear={handleClearSearch} />
      </Box>
      <Divider />
      <Typography variant="h5">Categorias</Typography>
      <TableContainer component={Paper} sx={{ flex: 1, minHeight: '30vh', maxHeight: '50vh', overflow: 'scroll' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={{ fontWeight: 800 }}>ID</TableCell>
              <TableCell align='left' sx={{ fontWeight: 800 }}>Nome</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Descrição</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Observação</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Criado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Atualizado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items && items.map((item: CatProps, i: number) => (
              <TableRow key={item.name} sx={{
                background:
                  i % 2 === 0
                    ? theme.palette.mode === 'light'
                      ? theme.palette.grey[50]
                      : theme.palette.grey[900]
                    : theme.palette.mode === 'light'
                      ? theme.palette.common.white
                      : theme.palette.common.black,
              }}>
                <TableCell scope="row" align='left' sx={{ fontWeight: 900 }}>
                  {item.id}
                </TableCell>
                <TableCell scope="row" align='left' >
                  {item.name}
                </TableCell>
                <TableCell align="right">{`${item.status ? 'Ativo' : 'Inativo'}`}</TableCell>
                <TableCell align="right">{item.description}</TableCell>
                <TableCell align="right">{item.obs}</TableCell>
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
      {
        data && data.length > 0 && (
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', flex: 0.1}}>
          <ButtonGroup
            variant="contained"
            aria-label="basic button group"
          >
            <Button onClick={() => handleChangePage(-1)} disabled={page === 1}>
              Anterior
            </Button>
            <Button onClick={() => handleChangePage(1)} disabled={!data || data.length === 0}>
              Próximo
            </Button>
          </ButtonGroup>
        </Box>
        )}
    </Box >
  );
};

export default CatList;