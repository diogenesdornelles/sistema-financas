import { JSX, useEffect, useState } from 'react';
import { List, ListItem, IconButton, Box, Chip, FormGroup, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserProps } from '../../../../packages/dtos/user.dto';
import { useGetAllUser, useDeleteUser } from '../../hooks/use-user';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles'

const UserList = (): JSX.Element | string => {
  const { isPending, error, data } = useGetAllUser();
  const { setFormType, setUpdateItem } = useFormStore();
  const [items, setItems] = useState<null | UserProps[]>([])
  const theme = useTheme()
  const [showInactives, setShowInactives] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')

  const onEdit = (item: UserProps) => {
    setFormType("user", "update");
    setUpdateItem("user", item);
  };

  useEffect(() => {
    if (data) {
      setItems(data)
    }
  }, [data])

  const delMutation = useDeleteUser();

  const filterItems = () => {
    if (!data) return;
  
    if (!search.trim()) {
      setItems(showInactives ? data : data.filter((item) => item.status));
      return;
    }
  
    const filteredItems = data.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = showInactives || item.status;
      return matchesSearch && matchesStatus;
    });
  
    setItems(filteredItems);
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

  if (isPending) return 'Carregando...';
  if (error) return <ErrorAlert message={error.message} />

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, marginLeft: 2 }}>
      <Typography variant='h4'>Filtro</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 0, flexShrink: 0, justifyContent: 'flex-start', alignItems: 'center', columnGap: 3 }}>
        <TextField
          label="Buscar por nome"
          value={search}
          variant="outlined"
          type="text"
          onChange={(e) => {
            setSearch(e.target.value)
            filterItems()
          }}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <FormGroup>
          <FormControlLabel control={<Switch value={showInactives} />} label="Mostrar Inativos" onChange={() => {
            setShowInactives((prev) => !prev)
            filterItems()
          }} />
        </FormGroup>
      </Box>
      <List sx={{ flex: 1, height: '100%', width: '100%' }}>
        {items &&
          items.map((item: UserProps, i: number) => (
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
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap', alignItems: 'baseline' }}>
                <Chip label={`${item.name} ${item.surname}`} color="success" />
                <Chip
                  label={`CPF: ${item.cpf}`}
                  variant="outlined"
                  size="small"
                />
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
    </Box>
  );
};

export default UserList;
