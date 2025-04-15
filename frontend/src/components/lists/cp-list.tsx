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

type QueryCpFormData = z.infer<typeof queryCpSchema>;

const CpList = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<CpProps[] | null>(null);
  const { isPending, error, data } = useGetManyCp((page - 1) * SKIP);
  const queryCpMutation = useQueryCp();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const theme = useTheme();

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

  const delMutation = useDeleteCp();

  const handleSearch = (data: QueryCpFormData) => {
    queryCpMutation.mutate(data);
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

  useEffect(() => {
    if (queryCpMutation.data) {
      setItems(queryCpMutation.data);
    } else if (data) {
      setItems(data);
    }
  }, [queryCpMutation.data, data]);

  if (error) return <ErrorAlert message={error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(isPending) && <CustomBackdrop isOpen={isPending} />}
      <Typography variant="h4">Filtro</Typography>
      <CpSearchForm onSearch={handleSearch} onClear={handleClearSearch}/>
      <Divider />
      <Typography variant="h4">Contas a pagar</Typography>
      <TableContainer component={Paper} sx={{ height: '100%' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="tabela de contas a pagar">
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
                  <TableCell align="right">{new Date(item.due).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{item.obs || '-'}</TableCell>
                  <TableCell align="right">{getPaymentStatusText(item.status)}</TableCell>
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

export default CpList;
