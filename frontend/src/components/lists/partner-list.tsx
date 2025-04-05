import { JSX } from 'react';
import { List, ListItem, IconButton, Box, Chip, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { PartnerProps } from '../../../../packages/dtos/partner.dto';
import { useGetAllPartner, useDeletePartner } from '../../hooks/use-partner';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { PartnerType } from '../../../../packages/dtos/utils/enums';
import { useTheme } from '@mui/material/styles'

const PartnerList = (): JSX.Element | string => {
  const { isPending, error, data } = useGetAllPartner();
  const theme = useTheme()
  const { setFormType, setUpdateItem } = useFormStore();

  const onEdit = (item: PartnerProps) => {
    setFormType("partner", "update");
    setUpdateItem("partner", item);
  };

  const delMutation = useDeletePartner();

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
   if (error) return <ErrorAlert message={error.message}/>

  return (
    <List sx={{ flex: 1, height: '100%', width: '100%' }}>
      {data &&
        data.map((item: PartnerProps, i : number) => (
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
            <Box sx={{ display: 'flex', width: '100%', gap: 2, flexDirection: 'column', justifyContent: 'center', alignItems: 'baseline' }}>
              <Stack direction="row" spacing={1}>
                <Chip label={item.name.toLocaleUpperCase()} color="success" />
                <Chip label={item.type} variant="outlined" size="small" />
                <Chip label={item.type === PartnerType.PF ? `Cod(CPF): ${item.cod}` : `Cod(CNPJ): ${item.cod}`} variant="outlined" size="small" />
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip
                  label={`Status: ${item.status ? 'Ativo' : 'Inativo'}`}
                  color={item.status ? 'primary' : 'error'}
                  variant="outlined"
                  size="small"
                />
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

export default PartnerList;
