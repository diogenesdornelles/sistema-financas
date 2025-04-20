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
import CustomBackdrop from '../custom-backdrop';

type CreateCatFormData = z.infer<typeof createCatSchema>;
type UpdateCatFormData = z.infer<typeof updateCatSchema>;

export function CreateCatForm(): JSX.Element | null {
    const mutation = usePostCat();
    const { forms } = useFormStore();
    const { session } = useAuth()

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCatFormData>({
        resolver: zodResolver(createCatSchema),
        defaultValues: {
            name: '',
            obs: '',
            description: '',
            user: session ? session?.user.id : ''
        }
    });

    const onSubmit = async (data: CreateCatFormData) => {
        try {
            await mutation.mutateAsync({ ...data });
            reset()
        } catch (err) {
            console.error("Erro ao criar categoria:", err);
        }
    };

    if (forms.cat.type === 'update') return null;

    return (

        <FormContainer formName='cat'>
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

            {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", minWidth: 500 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Nome"
                        {...register("name")}
                        variant="outlined"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        size="small"
                    />

                    <TextField
                        label="Descrição"
                        {...register("description")}
                        variant="outlined"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        multiline
                        rows={3}
                        size="small"
                    />

                    <TextField
                        label="Observações"
                        {...register("obs")}
                        variant="outlined"
                        error={!!errors.obs}
                        helperText={errors.obs?.message}
                        multiline
                        rows={3}
                        size="small"
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
    const { forms } = useFormStore();
    const mutation = usePutCat(forms.cat.updateItem ? forms.cat.updateItem.id : '');

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<UpdateCatFormData>({
        resolver: zodResolver(updateCatSchema),
        defaultValues: forms.cat.updateItem ? {
            name: forms.cat.updateItem.name,
            obs: forms.cat.updateItem.obs,
            description: forms.cat.updateItem.description,
            status: forms.cat.updateItem.status
        } : {},
    });

    const statusValue = watch("status");

    const onSubmit = async (data: UpdateCatFormData) => {
        try {
            await mutation.mutateAsync(data);
            reset({
                name: data.name,
                obs: data.obs,
                description: data.description,
                status: data.status
            })
        } catch (err) {
            console.error("Erro ao atualizar Categoria:", err);
        }
    };

    if (forms.cat.type === 'create' || !forms.cat.updateItem) return null;

    return (
        <FormContainer formName='cat'>
            <ButtonUpdateForm name='cat' title="Atualizar categoria" />

            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Categoria atualizada com sucesso!
                </Alert>
            )}

            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao atualizar o Categoria. Tente novamente.
                </Alert>
            )}

            {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", minWidth: 500 }}>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Nome"
                        {...register("name")}
                        variant="outlined"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        size="small"
                    />

                    <TextField
                        label="Descrição"
                        {...register("description")}
                        variant="outlined"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        multiline
                        size="small"
                        rows={3}
                    />

                    <TextField
                        label="Observações"
                        {...register("obs")}
                        variant="outlined"
                        error={!!errors.obs}
                        helperText={errors.obs?.message}
                        multiline
                        size="small"
                        rows={3}
                    />

                    <FormControlLabel
                        control={<Checkbox size="small" checked={statusValue} {...register("status")} />}
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

