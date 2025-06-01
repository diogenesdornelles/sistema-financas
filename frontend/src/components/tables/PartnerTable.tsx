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
import PartnerSearchForm from '@/components/forms/search/partnerSearchForm';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import { useDeletePartner } from '@/hooks/service/partner/useDeletePartner';
import { useGetManyPartner } from '@/hooks/service/partner/useGetManyPartner';
import { useQueryPartner } from '@/hooks/service/partner/useQueryPartner';
import { useFormStore } from '@/hooks/useFormStore';
import type { PartnerProps, queryPartnerSchema } from '@monorepo/packages';
import * as packages from '@monorepo/packages';
import ToastAlert from '@/components/alerts/ToastAlert';
const { PartnerType } = packages;

type QueryPartnerFormData = z.infer<typeof queryPartnerSchema>;

const PartnerTable = (): JSX.Element => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<PartnerProps[] | null>(null);
  const { isPending, error, data, isFetching, isRefetching, isLoading, refetch, isSuccess } = useGetManyPartner(
    (page - 1) * SKIP,
  );
  const queryPartnerMutation = useQueryPartner();
  const { setFormType, setUpdateItem, setIsOpen } = useFormStore();
  const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);
  const theme = useTheme();
  const delMutation = useDeletePartner();

  const onEdit = (item: PartnerProps) => {
    setFormType('partner', 'update');
    setIsOpen(true, 'partner');
    setUpdateItem('partner', {
      ...item,
      name: item.name,
      type: item.type ? item.type : undefined,
      cod: item.cod,
      obs: item.obs ? item.obs : '',
      status: item.status ? item.status : undefined,
    });
  };

  const handleSearch = (data: QueryPartnerFormData) => {
    queryPartnerMutation.mutate(data);
  };

  const handleClearSearch = async () => {
    queryPartnerMutation.reset();
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
      queryPartnerMutation.reset();
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
        (!queryPartnerMutation.data || queryPartnerMutation.data.length === 0)
      )
        return prev;
      return nextPage;
    });
  };

  useEffect(() => {
    if (queryPartnerMutation.data && queryPartnerMutation.data.length > 0) {
      setItems(queryPartnerMutation.data);
      return;
    } else if (data && data.length > 0) {
      setItems(data);
      return;
    } else if (!isPending && !isLoading && !isFetching && !queryPartnerMutation.isPending) {
      setItems(null);
      return;
    } else if (!queryPartnerMutation.data && !data) {
      setItems(null);
      return;
    } else {
      setItems(null);
      return;
    }
  }, [
    queryPartnerMutation.data,
    data,
    queryPartnerMutation.isSuccess,
    queryPartnerMutation.isPending,
    isSuccess,
    isPending,
    isLoading,
    isFetching,
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      {(error || queryPartnerMutation.isError) && (
        <ToastAlert severity="error" title="Erro" message={'Erro ao obter dados.'} open />
      )}
      {(isPending ||
        isLoading ||
        isFetching ||
        isRefetching ||
        delMutation.isPending ||
        queryPartnerMutation.isPending) && <CustomBackdrop isOpen={true} />}

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Typography variant="h5">Filtro</Typography>
        <PartnerSearchForm onSearch={handleSearch} onClear={handleClearSearch} />
      </Box>
      <Divider />
      <Typography variant="h5">Parceiros</Typography>
      <TableContainer component={Paper} sx={{ flex: 1, minHeight: '30vh', maxHeight: '50vh', overflow: 'scroll' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: 800 }}>
                ID
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: 800 }}>
                Parceiro
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Tipo
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Código
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
                Obs
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 800 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items && items.length > 0 ? (
              items.map((item: PartnerProps, i: number) => (
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
                  <TableCell align="left">{item.name.toUpperCase()}</TableCell>
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
                    <IconButton edge="end" aria-label="delete" onClick={() => handleOpenDeleteDialog(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={20} align="center">
                  Nenhum parceiro encontrado.
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

export default PartnerTable;
