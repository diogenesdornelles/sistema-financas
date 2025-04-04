import { JSX } from 'react';
import { List, ListItem, IconButton, Box, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TxProps } from '../../../../packages/dtos/tx.dto';
import { useGetAllTx, useDeleteTx } from '../../hooks/use-tx';
import { useFormStore } from '../../hooks/use-form-store';
import { TransactionType } from '../../../../packages/dtos/utils/enums';
import ErrorAlert from '../alerts/error-alert';

const TxList = (): JSX.Element | string => {
  const { isPending, error, data } = useGetAllTx();
  const { setFormType, setUpdateItem } = useFormStore();

  const onEdit = (item: TxProps) => {
    setFormType("tx", "update");
    setUpdateItem("tx", {
      ...item,
      cf: item.cf.id,
      category: item.category.id,
      value: String(item.value),
      tdate: item.tdate ? item.tdate.toISOString() : '',
    });
  };

  const delMutation = useDeleteTx();

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
      {data && data.map((item: TxProps) => (
        <ListItem
          key={item.id}
          divider
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap', alignItems: 'baseline' }}>
            <Chip
              label={`Conta: ${item.cf.id}`}
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Tipo: ${item.type === TransactionType.ENTRY ? 'Entrada' : 'Saída'}`}
              color={item.type === TransactionType.ENTRY ? "success" : "error"}
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Valor: R$ ${item.value}`}
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Categoria: ${item.category.name}`}
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Descrição: ${item.description}`}
              variant="outlined"
              size="small"
            />
            <Chip
              label={`Status: ${item.status ? 'Ativo' : 'Inativo'}`}
              color={item.status ? "primary" : "error"}
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
            {item.obs && (
              <Chip
                label={`Obs: ${item.obs}`}
                variant="outlined"
                size="small"
              />
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

export default TxList;
