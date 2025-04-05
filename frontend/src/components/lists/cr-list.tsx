import { JSX } from 'react';
import { List, ListItem, IconButton, Box, Chip, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CrProps } from '../../../../packages/dtos/cr.dto';
import { useGetAllCr, useDeleteCr } from '../../hooks/use-cr';
import { useFormStore } from '../../hooks/use-form-store';
import { PaymentStatus } from '../../../../packages/dtos/utils/enums';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles'

const CrList = (): JSX.Element | string => {
  const { isPending, error, data } = useGetAllCr();
  const { setFormType, setUpdateItem } = useFormStore();
  const theme = useTheme()

  const onEdit = (item: CrProps) => {
    setFormType("cr", "update");
    setUpdateItem("cr", {
        ...item,
        type: item.type.id,
        tx: item.tx ? item.tx.id : undefined,
        customer: item.customer.id,
        value: String(item.value)
    });
  };

  const delMutation = useDeleteCr();

  const onDelete = async (id: string) => {
    if (confirm('Deseja deletar?')) {
      try {
        await delMutation.mutateAsync(id);
      } catch (err) {
        console.error('Erro ao deletar o item:', err);
      }
    }
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

  if (isPending) return 'Carregando...';
  if (error) return <ErrorAlert message={error.message}/>

  return (
    <List sx={{ flex: 1, height: '100%', width: '100%' }}>
      {data && data.map((item: CrProps, i: number) => (
        <ListItem
          key={item.id}
          divider
          sx={{
            display: 'flex',
            padding: 2,
            justifyContent: 'space-between',
            alignItems: 'center',
            background: `${i % 2 === 0 ? (theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900]) : (theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.common.black)}`
            
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Stack direction="row" spacing={1}>
              <Chip label={`Valor: R$ ${item.value}`} variant="outlined" size="small" />
              <Chip label={`Tipo: ${item.type.name}`} variant="outlined" size="small" />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Chip label={`Cliente: ${item.customer.name}`} variant="outlined" size="small" />
              <Chip label={`Vencimento: ${new Date(item.due).toLocaleDateString()}`} variant="outlined" size="small" />
              {item.rdate && (
                <Chip label={`Recebido em: ${new Date(item.rdate).toLocaleDateString()}`} variant="outlined" size="small" />
              )}
            </Stack>
            <Stack direction="row" spacing={1}>
              <Chip label={`Status: ${getPaymentStatusText(item.status)}`} variant="outlined" size="small" />
              <Chip label={`Criado em: ${new Date(item.createdAt).toLocaleDateString()}`} variant="outlined" size="small" />
              <Chip label={`Atualizado em: ${new Date(item.updatedAt).toLocaleDateString()}`} variant="outlined" size="small" />
            </Stack>
            {item.obs && (
              <Stack direction="row" spacing={1}>
                <Chip label={`Obs: ${item.obs}`} variant="outlined" size="small" />
              </Stack>
            )}
            {item.tx && (
              <Stack direction="row" spacing={1}>
                <Chip label={`Transação: ${item.tx.id}`} variant="outlined" size="small" />
              </Stack>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton edge="end" aria-label="edit" onClick={() => onEdit(item)}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default CrList;
