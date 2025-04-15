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
import { PartnerProps } from '../../../../packages/dtos/partner.dto';
import { useDeletePartner, useGetManyPartner, useQueryPartner } from '../../hooks/use-partner';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles';
import PartnerSearchForm from '../forms/search/partner-search-form';
import { PartnerType } from '../../../../packages/dtos/utils/enums';
import { z } from 'zod';
import { queryPartnerSchema } from '../../../../packages/validators/zod-schemas/query/query-partner.validator';
import CustomBackdrop from '../custom-backdrop';

type QueryPartnerFormData = z.infer<typeof queryPartnerSchema>;

const PartnerList = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<PartnerProps[] | null>(null);
  const { isPending, error, data } = useGetManyPartner((page - 1) * SKIP);
  const queryPartnerMutation = useQueryPartner();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const theme = useTheme();

  const onEdit = (item: PartnerProps) => {
    setFormType('partner', 'update');
    setIsOpen(true, 'partner')
    setUpdateItem('partner', {
      ...item,
      name: item.name,
      type: item.type ? item.type : undefined,
      cod: item.cod,
      obs: item.obs ? item.obs : '',
      status: item.status ? item.status : undefined,
    });
  };

  const delMutation = useDeletePartner();

  const handleSearch = (data: QueryPartnerFormData) => {
    queryPartnerMutation.mutate(data);
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

  const handleClearSearch = () => {
    setItems(data || null);
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
    if (queryPartnerMutation.data) {
      setItems(queryPartnerMutation.data);
    } else if (data) {
      setItems(data);
    }
  }, [queryPartnerMutation.data, data]);

  if (error) return <ErrorAlert message={error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(isPending) && <CustomBackdrop isOpen={isPending} />}
      <Typography variant="h4">Filtro</Typography>
      <PartnerSearchForm onSearch={handleSearch} onClear={handleClearSearch}/>
      <Divider />
      <Typography variant="h4">Parceiros</Typography>
      <TableContainer component={Paper} sx={{ height: '100%' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="tabela de parceiros">
          <TableHead>
            <TableRow>
              <TableCell align='left' sx={{ fontWeight: 800 }}>ID</TableCell>
              <TableCell align='left' sx={{ fontWeight: 800 }}>Parceiro</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Tipo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Código</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Criado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Atualizado em</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Obs</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items &&
              items.map((item: PartnerProps, i: number) => (
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
                  <TableCell align='left'>{item.name.toUpperCase()}</TableCell>
                  <TableCell align="right">{item.type}</TableCell>
                  <TableCell align="right">
                    {item.type === PartnerType.PF ? `CPF: ${item.cod}` : `CNPJ: ${item.cod}`}
                  </TableCell>
                  <TableCell align="right">{item.status ? 'Ativo' : 'Inativo'}</TableCell>
                  <TableCell align="right">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{item.obs || '-'}</TableCell>
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

export default PartnerList;
