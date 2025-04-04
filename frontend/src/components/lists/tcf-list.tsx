import { JSX } from 'react';
import { List, ListItem, IconButton, Box, Chip, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { TcfProps } from '../../../../packages/dtos/tcf.dto';
import { useGetAllTcf, useDeleteTcf } from '../../hooks/use-tcf';
import { useFormStore } from '../../hooks/use-form-store';

const TcfList = (): JSX.Element | string => {
  const { isPending, error, data } = useGetAllTcf();
  const { setFormType, setUpdateItem } = useFormStore();

  const onEdit = (item: TcfProps) => {
    setFormType("tcf", "update");
    setUpdateItem("tcf", item);
  };

  const delMutation = useDeleteTcf();

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
    <>
      <List sx={{ flex: 1, height: '100%', width: '100%' }}>
        {data &&
          data.map((item) => (
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
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onEdit(item)} // Chama a função para abrir o modal
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDelete(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
      </List>
    </>
  );
};

export default TcfList;