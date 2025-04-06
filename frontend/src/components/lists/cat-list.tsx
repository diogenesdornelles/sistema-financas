import { JSX, useEffect, useState } from 'react';
import {
  List,
  ListItem,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Typography,
  ButtonGroup,
  Button,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CatProps } from '../../../../packages/dtos/cat.dto';
import { useDeleteCat, useGetManyCat, useQueryCat } from '../../hooks/use-cat';
import { useFormStore } from '../../hooks/use-form-store';
import ErrorAlert from '../alerts/error-alert';
import { useTheme } from '@mui/material/styles';
import { z } from 'zod';
import { queryCatSchema } from '../../../../packages/validators/zod-schemas/query/query-cat.validator';
import CatSearchForm from '../forms/search/cat-search-form';

type QueryCatFormData = z.infer<typeof queryCatSchema>;

const CatList = (): JSX.Element | string => {
  const SKIP = 10;
  const [page, setPage] = useState(1);
  const { isPending, error, data } = useGetManyCat((page - 1) * SKIP)
  const { setFormType, setUpdateItem } = useFormStore();
  const theme = useTheme();
  const [items, setItems] = useState<CatProps[] | null>(null);
  const queryCatMutation = useQueryCat();

  const onEdit = (item: CatProps) => {
    setFormType('cat', 'update');
    setUpdateItem('cat', item);
  };

  const delMutation = useDeleteCat();

  const handleSearch = (data: QueryCatFormData) => {
    queryCatMutation.mutate(data);
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

  const handleChangePage = (direction: number) => {
    setPage((prev) => {
      const nextPage = prev + direction;

      // Garante que a página não seja menor que 1
      if (nextPage < 1) return prev;

      // Garante que a próxima página só seja acessada se houver dados
      if (direction > 0 && (!data || data.length === 0)) return prev;

      return nextPage;
    });
  };

  useEffect(() => {
    if (queryCatMutation.data) {
      setItems(queryCatMutation.data);
    } else if (data) {
      setItems(data);
    }
  }, [queryCatMutation.data, data]);


  if (isPending) return 'Carregando...';
  if (error) return <ErrorAlert message={error.message} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', rowGap: 2, mx: 2 }}>
      <Typography variant="h4">Filtro</Typography>
      <CatSearchForm onSearch={handleSearch} />
      <Divider />
      <Typography variant="h4">Categorias</Typography>
      <List sx={{padding: 2, flex: 1, width: '100%', maxHeight: 400, overflow: 'auto', cursor: "all-scroll" }}>
        {items &&
          items.map((item: CatProps, i: number) => (
            <ListItem
              key={item.id}
              divider
              sx={{
                display: 'flex',
                p: 2,
                justifyContent: 'space-between',
                alignItems: 'center',
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
                {item.obs && <Chip label={`Obs: ${item.obs}`} variant="outlined" size="small" />}
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
      {data.length > 0 && (
        <ButtonGroup
          variant="contained"
          aria-label="Basic button group"
          sx={{ marginBottom: 2, flex: 0, width: 'fit-content', alignSelf: 'center' }}
        >
          <Button onClick={() => handleChangePage(-1)} disabled={page === 1}>
            Anterior
          </Button>
          <Button onClick={() => handleChangePage(1)} disabled={!data || data.length === 0}>
            Próximo
          </Button>
        </ButtonGroup>
      )}
    </Box>
  );
};

export default CatList;