import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Alert, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { JSX } from 'react';
import { useFormStore } from '../../hooks/use-form-store';
import { createCatSchema } from '../../../../packages/validators/zod-schemas/create/create-cat.validator';
import { updateCatSchema } from '../../../../packages/validators/zod-schemas/update/update-cat.validator';
import { usePostCat, usePutCat } from '../../hooks/use-cat';
import { useAuth } from '../../hooks/use-auth';
import FormContainer from './templates/form-container';
import ButtonUpdateForm from './templates/button-update-form';

type CreateCatFormData = z.infer<typeof createCatSchema>;
type UpdateCatFormData = z.infer<typeof updateCatSchema>;

export function CreateCatForm(): JSX.Element | null {
    const mutation = usePostCat();
    const { forms } = useFormStore();
    const { session } = useAuth()

    const { register, handleSubmit, formState: { errors } } = useForm<CreateCatFormData>({
        resolver: zodResolver(createCatSchema),
        defaultValues: {
            name: '',
            obs: undefined,
            description: undefined,
            user: session ? session?.user.id : ''
        }
    });

    const onSubmit = async (data: CreateCatFormData) => {
        try {
            await mutation.mutateAsync({ ...data });
        } catch (err) {
            console.error("Erro ao criar categoria:", err);
        }
    };

    if (forms.cat.type === 'update') return null;

    return (

        <FormContainer>
            <Typography variant="h4">Nova Categoria</Typography>

            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Categoria criada com sucesso!
                </Alert>
            )}
            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    {mutation.error?.message || "Ocorreu um erro ao criar categoria. Tente novamente."}
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

                    <TextField
                        label="Descrição"
                        {...register("description")}
                        variant="outlined"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        multiline
                        rows={3}
                    />

                    <TextField
                        label="Observações"
                        {...register("obs")}
                        variant="outlined"
                        error={!!errors.obs}
                        helperText={errors.obs?.message}
                        multiline
                        rows={3}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Enviando..." : "Criar Categoria"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}

export function UpdateCatForm(): JSX.Element | null {
    const mutation = usePutCat();
    const { forms } = useFormStore();

    const { register, handleSubmit, watch, formState: { errors } } = useForm<UpdateCatFormData>({
        resolver: zodResolver(updateCatSchema),
        defaultValues: forms.cat.updateItem || {},
    });

    const statusValue = watch("status");

    const onSubmit = async (data: UpdateCatFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (err) {
            console.error("Erro ao atualizar Categoria:", err);
        }
    };

    if (forms.cat.type === 'create' || !forms.cat.updateItem) return null;

    return (
        <FormContainer>
            <ButtonUpdateForm name='cat' title="Atualizar categoria"/>
            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Categoria atualizado com sucesso!
                </Alert>
            )}

            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao atualizar o Categoria. Tente novamente.
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

                    <TextField
                        label="Descrição"
                        {...register("description")}
                        variant="outlined"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        multiline
                        rows={3}
                    />

                    <TextField
                        label="Observações"
                        {...register("obs")}
                        variant="outlined"
                        error={!!errors.obs}
                        helperText={errors.obs?.message}
                        multiline
                        rows={3}
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
                        {mutation.isPending ? "Atualizando..." : "Atualizar Categoria"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}

