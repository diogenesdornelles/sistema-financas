import { JSX } from 'react';
import { List, ListItem, IconButton, Box, Chip, Stack, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CatProps } from '../../../../packages/dtos/cat.dto';
import { useGetAllCat, useDeleteCat } from '../../hooks/use-cat';
import { useFormStore } from '../../hooks/use-form-store';

const CatList = (): JSX.Element | string => {
  const { isPending, error, data } = useGetAllCat();
  const { setFormType, setUpdateItem } = useFormStore();

  const onEdit = (item: CatProps) => {
    setFormType("cat", "update");
    setUpdateItem("cat", item);
  };

  const delMutation = useDeleteCat();

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
  if (error) return 'Ocorreu um erro: ' + error.message;

  return (
    <List sx={{ flex: 1, height: '100%', width: '100%' }}>
      {data &&
        data.map((item: CatProps) => (
          <ListItem
            key={item.id}
            divider
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Stack direction="row" spacing={1}>
                <Chip label={item.name} color="success" />
                {item.description && (
                  <Tooltip title={item.description}>
                    <Chip label="Descrição" variant="outlined" size="small" />
                  </Tooltip>
                )}
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
                  color="default"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`Atualizado em: ${new Date(item.updatedAt).toLocaleDateString()}`}
                  color="default"
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

export default CatList;
