/* eslint-disable react-hooks/exhaustive-deps */
import { JSX, useEffect, useState } from 'react';
import { List, ListItem, IconButton, Box, Chip, FormGroup, FormControlLabel, Switch, TextField, Typography, Button } from '@mui/material';
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
  const [searchParams, setSearchParams] = useState<{
    name: string;
    cpf: string;
    created: Date | null;
    updated: Date | null;
  }>({
    name: '',
    cpf: '',
    created: null,
    updated: null,
  });

  const onEdit = (item: UserProps) => {
    setFormType("user", "update");
    setUpdateItem("user", item);
  };


  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);


  const delMutation = useDeleteUser();

  const filterItems = () => {
    if (!data) return;

    let filtered = data;

    if (searchParams.name.trim() !== "") {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchParams.name.toLowerCase())
      );
    }

    if (searchParams.cpf.trim() !== "") {
      filtered = filtered.filter(item =>
        item.cpf.includes(searchParams.cpf)
      );
    }

    if (searchParams.created) {
      const createdDateStr = new Date(searchParams.created).toDateString();
      filtered = filtered.filter(item =>
        new Date(item.createdAt).toDateString() === createdDateStr
      );
    }

    if (searchParams.updated) {
      const updatedDateStr = new Date(searchParams.updated).toDateString();
      filtered = filtered.filter(item =>
        new Date(item.updatedAt).toDateString() === updatedDateStr
      );
    }

    if (!showInactives) {
      filtered = filtered.filter(item => item.status);
    }

    setItems(filtered);
  };

  useEffect(() => {
    filterItems();
  }, [data, searchParams, showInactives]);

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
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        <TextField
          label="Buscar por nome"
          value={searchParams.name}
          variant="outlined"
          onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          label="Buscar por CPF"
          value={searchParams.cpf}
          variant="outlined"
          onChange={(e) => setSearchParams(prev => ({ ...prev, cpf: e.target.value }))}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          label="Criação"
          variant="outlined"
          type="date"
          onChange={(e) => setSearchParams(prev => ({ ...prev, created: e.target.value ? new Date(e.target.value) : null }))}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          label="Alteração"
          variant="outlined"
          type="date"
          onChange={(e) => setSearchParams(prev => ({ ...prev, updated: e.target.value ? new Date(e.target.value) : null }))}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={showInactives}
                onChange={() => setShowInactives(prev => !prev)}
              />
            }
            label="Mostrar Inativos"
          />
        </FormGroup>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSearchParams({ name: '', cpf: '', created: null, updated: null });
            setShowInactives(false);
          }}
        >
          Limpar
        </Button>
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
