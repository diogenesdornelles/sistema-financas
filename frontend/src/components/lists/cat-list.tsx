import { JSX, useEffect, useState } from 'react';
import { 
  List, 
  ListItem, 
  IconButton, 
  Box, 
  Chip, 
  Tooltip, 
  Button, 
  FormControlLabel, 
  FormGroup, 
  TextField, 
  Typography, 
  Switch 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CatProps } from '../../../../packages/dtos/cat.dto';
import { useGetAllCat, useDeleteCat } from '../../hooks/use-cat';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles';

const CatList = (): JSX.Element | string => {
  const { isPending, error, data } = useGetAllCat();
  const { setFormType, setUpdateItem } = useFormStore();
  const [showInactives, setShowInactives] = useState<boolean>(false);
  const [items, setItems] = useState<CatProps[]>([]);
  const theme = useTheme();
  // Utilizamos strings para datas no formato "YYYY-MM-DD"
  const [searchParams, setSearchParams] = useState<{
    name: string;
    description: string;
    obs: string;
    created: string;
    updated: string;
  }>({
    name: '',
    description: '',
    obs: '',
    created: '',
    updated: '',
  });

  const onEdit = (item: CatProps) => {
    setFormType("cat", "update");
    setUpdateItem("cat", item);
  };

  const delMutation = useDeleteCat();

  const filterItems = () => {
    if (!data) return;

    let filtered = data;

    if (searchParams.name.trim() !== '') {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchParams.name.toLowerCase())
      );
    }

    if (searchParams.description.trim() !== '') {
      filtered = filtered.filter(item =>
        item.description?.toLowerCase().includes(searchParams.description.toLowerCase())
      );
    }

    if (searchParams.obs.trim() !== '') {
      filtered = filtered.filter(item =>
        item.obs?.toLowerCase().includes(searchParams.obs.toLowerCase())
      );
    }

    if (searchParams.created !== '') {
      filtered = filtered.filter(item => {
        const createdDate = new Date(item.createdAt).toISOString().split('T')[0];
        return createdDate === searchParams.created;
      });
    }

    if (searchParams.updated !== '') {
      filtered = filtered.filter(item => {
        const updatedDate = new Date(item.updatedAt).toISOString().split('T')[0];
        return updatedDate === searchParams.updated;
      });
    }

    if (!showInactives) {
      filtered = filtered.filter(item => item.status);
    }

    setItems(filtered);
  };

  // Atualiza os itens sempre que data, parâmetros de busca ou flag mudam
  useEffect(() => {
    filterItems();
  }, [data, searchParams, showInactives]);

  // Quando os dados são carregados, se nenhum filtro estiver ativo, exibe a lista completa
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

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
  if (error) return <ErrorAlert message={error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      <Typography variant='h4'>Filtro</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        <TextField
          label="Buscar por nome"
          value={searchParams.name}
          variant="outlined"
          onChange={(e) =>
            setSearchParams(prev => ({ ...prev, name: e.target.value }))
          }
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          label="Buscar por descrição"
          value={searchParams.description}
          variant="outlined"
          onChange={(e) =>
            setSearchParams(prev => ({ ...prev, description: e.target.value }))
          }
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          label="Buscar por observação"
          value={searchParams.obs}
          variant="outlined"
          onChange={(e) =>
            setSearchParams(prev => ({ ...prev, obs: e.target.value }))
          }
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          label="Criação"
          value={searchParams.created}
          variant="outlined"
          type="date"
          onChange={(e) =>
            setSearchParams(prev => ({ ...prev, created: e.target.value }))
          }
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
        <TextField
          label="Alteração"
          value={searchParams.updated}
          variant="outlined"
          type="date"
          onChange={(e) =>
            setSearchParams(prev => ({ ...prev, updated: e.target.value }))
          }
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
            setSearchParams({ name: '', description: '', obs: '', created: '', updated: '' });
            setShowInactives(false);
          }}
        >
          Limpar
        </Button>
      </Box>
      <List sx={{ flex: 1, width: '100%', overflow: 'auto' }}>
        {items.map((item: CatProps, i: number) => (
          <ListItem
            key={item.id}
            divider
            sx={{
              display: 'flex',
              p: 2,
              justifyContent: 'space-between',
              alignItems: 'center',
              background: i % 2 === 0 
                ? (theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900])
                : (theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.common.black)
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap', alignItems: 'baseline' }}>
              <Chip label={item.name} color="success" />
              {item.description && (
                <Tooltip title={item.description}>
                  <Chip label="Descrição" variant="outlined" size="small" />
                </Tooltip>
              )}
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
              {item.obs && (
                <Chip label={`Obs: ${item.obs}`} variant="outlined" size="small" />
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
    </Box>
  );
};

export default CatList;
