import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { createTcrSchema } from '../../../../packages/validators/zod-schemas/create/create-tcr.validator';
import { updateTcrSchema } from '../../../../packages/validators/zod-schemas/update/update-tcr.validator';
import { usePostTcr, usePutTcr } from '../../hooks/use-tcr';
import { useFormStore } from '../../hooks/use-form-store';
import { JSX } from 'react';
import FormContainer from './templates/form-container';
import ButtonUpdateForm from './templates/button-update-form';

type CreateTcrFormData = z.infer<typeof createTcrSchema>;
type UpdateTcrFormData = z.infer<typeof updateTcrSchema>;

export function CreateTcrForm(): JSX.Element | null {
    const mutation = usePostTcr();
    const { forms } = useFormStore();


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateTcrFormData>({
        resolver: zodResolver(createTcrSchema),
        defaultValues: {
            name: ''
          }
    });

    const onSubmit = async (data: CreateTcrFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (err) {
            console.error("Erro ao criar Tipo de conta a receber:", err);
        }
    };

    // Exibe o formulário de criação somente se o modo for 'create'
    if (forms.tcr.type === 'update') return null;

    return (
        <FormContainer>
            <Typography variant="h4">Novo Tipo de conta a receber</Typography>

            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Tipo de conta a receber criado com sucesso!
                </Alert>
            )}

            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao criar o Tipo de conta a receber. Tente novamente.
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Nome"
                        {...register("name")}
                        variant="outlined"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Enviando..." : "Criar Tipo"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}

export function UpdateTcrForm(): JSX.Element | null {
    const mutation = usePutTcr();
    const { forms } = useFormStore();



    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<UpdateTcrFormData>({
        resolver: zodResolver(updateTcrSchema),
        defaultValues: forms.tcr.updateItem || {},
    });

    const statusValue = watch("status");

    const onSubmit = async (data: UpdateTcrFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (err) {
            console.error("Erro ao atualizar o Tipo de conta a receber:", err);
        }
    };
    // Exibe este formulário somente se o modo for 'update' e houver dados para atualizar
    if (forms.tcr.type === 'create' || !forms.tcr.updateItem) return null;

    return (
        <FormContainer>
            <ButtonUpdateForm title="Atualizar Tipo de conta a receber" name='tcr'/>

            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Tipo de conta a receber atualizado com sucesso!
                </Alert>
            )}

            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao atualizar o Tipo de conta a receber. Tente novamente.
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Nome"
                        {...register("name")}
                        variant="outlined"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />

                    <FormControlLabel
                        control={<Checkbox {...register("status")} />}
                        label={`Status: ${statusValue ? "Ativo" : "Inativo"}`}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Atualizando..." : "Atualizar Tipo"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}
