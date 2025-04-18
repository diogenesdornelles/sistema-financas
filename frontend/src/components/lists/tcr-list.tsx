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
import { TcrProps } from '../../../../packages/dtos/tcr.dto';
import { useDeleteTcr, useGetManyTcr, useQueryTcr } from '../../hooks/use-tcr';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles';
import TcrSearchForm from '../forms/search/tcr-search-form';
import { queryTcrSchema } from '../../../../packages/validators/zod-schemas/query/query-tcr.validator';
import { z } from 'zod';
import CustomBackdrop from '../custom-backdrop';

type QueryTcrFormData = z.infer<typeof queryTcrSchema>;

const TcrList = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<TcrProps[] | null>(null);
  const { isPending, error, data } = useGetManyTcr((page - 1) * SKIP);
  const queryTcrMutation = useQueryTcr();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const theme = useTheme();

  const onEdit = (item: TcrProps) => {
    setFormType('tcr', 'update');
    setIsOpen(true, 'tcr')
    setUpdateItem('tcr', {
      ...item,
      name: item.name,
      status: item.status ? item.status : undefined,
    });
  };

  const delMutation = useDeleteTcr();

  const handleSearch = (data: QueryTcrFormData) => {
    queryTcrMutation.mutate(data);
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
    if (queryTcrMutation.data) {
      setItems(queryTcrMutation.data);
    } else if (data) {
      setItems(data);
    }
  }, [queryTcrMutation.data, data]);

  if (error) return <ErrorAlert message={error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(isPending) && <CustomBackdrop isOpen={isPending} />}
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Typography variant="h5">Filtro</Typography>
        <TcrSearchForm onSearch={handleSearch} onClear={handleClearSearch} />
      </Box>
      <Divider />
      <Typography variant="h5">Tipos de contas a receber</Typography>
      <TableContainer component={Paper} sx={{ flex: 1, minHeight: '30vh', maxHeight: '50vh', overflow: 'scroll' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="tabela de tipos de contas a receber">
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={{ fontWeight: 800 }}>ID</TableCell>
              <TableCell align='left' sx={{ fontWeight: 800 }}>Nome</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Criado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Atualizado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items &&
              items.map((item: TcrProps, i: number) => (
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
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', flex: 0.1 }}>
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
    </Box>
  );
};

export default TcrList;
