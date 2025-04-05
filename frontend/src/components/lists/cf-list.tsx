import { JSX } from 'react';
import { List, ListItem, IconButton, Box, Chip, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CfProps } from '../../../../packages/dtos/cf.dto';
import { useGetAllCf, useDeleteCf } from '../../hooks/use-cf';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles'
import { strToPtBrMoney } from '../../utils/strToPtBrMoney';


const CfList = (): JSX.Element | string => {
  const { isPending, error, data } = useGetAllCf();
  const { setFormType, setUpdateItem } = useFormStore();
  const theme = useTheme()

  const onEdit = (item: CfProps) => {
    setFormType("cf", "update");
    setUpdateItem("cf", {
      ...item,
      type: item.type.id,
      ag: item.ag ? item.ag : undefined,
      bank: item.bank ? item.bank : undefined,
      obs: item.obs ? item.obs : undefined,
      balance: strToPtBrMoney(String(item.balance))
    });
  };

  const delMutation = useDeleteCf();

  const onDelete = async (id: string) => {
    if (confirm('Deseja deletar?')) {
      try {
        await delMutation.mutateAsync(id);
      } catch (err) {
        console.error('Erro ao deletar o item:', err);
      }
    }
  };

  if (isPending) return 'Carregando...';
  if (error) return <ErrorAlert message={error.message} />

  return (
    <List sx={{ flex: 1, height: '100%', width: '100%' }}>
      {data && data.map((item: CfProps, i: number) => (
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
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
            <Stack direction="row" spacing={1}>
              <Chip label={`Conta: ${item.number}`} color="success" />
              <Chip label={`Ag: ${item.ag || '-'}`} variant="outlined" size="small" />
              <Chip label={`Banco: ${item.bank || '-'}`} variant="outlined" size="small" />
              <Chip
                label={`Status: ${item.status ? 'Ativo' : 'Inativo'}`}
                color={item.status ? 'primary' : 'error'}
                variant="outlined"
                size="small"
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Chip label={`Tipo: ${item.type.name}`} variant="outlined" size="small" />
              <Chip label={`Saldo: R$ ${strToPtBrMoney(String(item.balance))}`} variant="outlined" size="small" />
              <Chip
                label={`Criado em: ${new Date(item.createdAt).toLocaleDateString()}`}
                variant="outlined"
                size="small"
              />
              <Chip
                label={`Atualizado em: ${new Date(item.updatedAt).toLocaleDateString()}`}
                variant="outlined"
                size="small"
              />
            </Stack>
            {item.obs && (
              <Stack direction="row" spacing={1}>
                <Chip label={`Obs: ${item.obs}`} variant="outlined" size="small" />
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

export default CfList;
