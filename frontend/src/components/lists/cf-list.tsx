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
import { CfProps } from '../../../../packages/dtos/cf.dto';
import { useDeleteCf, useGetManyCf, useQueryCf } from '../../hooks/use-cf';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles';
import CfSearchForm from '../forms/search/cf-search-form';
import { queryCfSchema } from '../../../../packages/validators/zod-schemas/query/query-cf.validator';
import { z } from 'zod';
import { strToPtBrMoney } from '../../utils/strToPtBrMoney';
import CustomBackdrop from '../custom-backdrop';

type QueryCfFormData = z.infer<typeof queryCfSchema>;

const CfList = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<CfProps[] | null>(null);
  const { isPending, error, data } = useGetManyCf((page - 1) * SKIP);
  const queryCfMutation = useQueryCf();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const theme = useTheme();

  const onEdit = (item: CfProps) => {
    setFormType('cf', 'update');
    setIsOpen(true, 'cf')
    setUpdateItem('cf', {
      ...item,
      number: item.number,
      type: item.type.id,
      ag: item.ag || undefined,
      bank: item.bank || undefined,
      obs: item.obs || undefined,
      status: item.status,
      balance: String(item.balance),
    });
  };

  const delMutation = useDeleteCf();

  const handleSearch = (data: QueryCfFormData) => {
    queryCfMutation.mutate(data);
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
    if (queryCfMutation.data) {
      setItems(queryCfMutation.data);
    } else if (data) {
      setItems(data);
    }
  }, [queryCfMutation.data, data]);

  if (error) return <ErrorAlert message={error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(isPending) && <CustomBackdrop isOpen={isPending} />}
      <Typography variant="h4">Filtro</Typography>
      <CfSearchForm onSearch={handleSearch} />
      <Divider />
      <Typography variant="h4" sx={{ marginTop: 0 }}>
        Contas financeiras
      </Typography>
      <TableContainer component={Paper} sx={{ height: '100%' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" >
          <TableHead>
            <TableRow>
            <TableCell align='left' sx={{ fontWeight: 800 }}>ID</TableCell>
              <TableCell align='left' sx={{ fontWeight: 800 }}>Número</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Agência</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Banco</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Tipo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Saldo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Observações</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Criado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Atualizado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items &&
              items.map((item: CfProps, i: number) => (
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
                  <TableCell scope="row" align='left'>
                    {item.number}
                  </TableCell>
                  <TableCell align="right">{item.ag || '-'}</TableCell>
                  <TableCell align="right">{item.bank || '-'}</TableCell>
                  <TableCell align="right">{item.status ? 'Ativo' : 'Inativo'}</TableCell>
                  <TableCell align="right">{item.type.name}</TableCell>
                  <TableCell align="right">R$ {strToPtBrMoney(String(item.balance))}</TableCell>
                  <TableCell align="right">{item.obs || '-'}</TableCell>
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

export default CfList;