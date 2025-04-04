import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Checkbox, FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { createTcrSchema } from '../../../../packages/validators/zod-schemas/create/create-tcr.validator';
import { updateTcrSchema } from '../../../../packages/validators/zod-schemas/update/update-tcr.validator';
import { usePostTcr, usePutTcr } from '../../hooks/use-tcr';
import { useFormStore } from '../../hooks/use-form-store';
import { JSX } from 'react';

type CreateTcrFormData = z.infer<typeof createTcrSchema>;
type UpdateTcrFormData = z.infer<typeof updateTcrSchema>;

export function CreateTcrForm(): JSX.Element | null {
    const theme = useTheme();
    const mutation = usePostTcr();
    const { forms } = useFormStore();


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateTcrFormData>({
        resolver: zodResolver(createTcrSchema),
    });

    const onSubmit = async (data: CreateTcrFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (err) {
            console.error("Erro ao criar TCR:", err);
        }
    };

    // Exibe o formulário de criação somente se o modo for 'create'
    if (forms.tcr.type === 'update') return null;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 3,
                minHeight: 500,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    padding: 4,
                    maxWidth: 400,
                    borderRadius: 1,
                    boxShadow: theme.shadows[24],
                    bgcolor: theme.palette.mode === "light"
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                }}
            >
                <h1>Novo TCR</h1>

                {mutation.isSuccess && (
                    <Alert severity="success" style={{ width: "100%" }}>
                        TCR criado com sucesso!
                    </Alert>
                )}

                {mutation.isError && (
                    <Alert severity="error" style={{ width: "100%" }}>
                        Ocorreu um erro ao criar o TCR. Tente novamente.
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
                            {mutation.isPending ? "Enviando..." : "Criar TCR"}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}

export function UpdateTcrForm(): JSX.Element | null {
    const theme = useTheme();
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
            console.error("Erro ao atualizar o TCR:", err);
        }
    };
    // Exibe este formulário somente se o modo for 'update' e houver dados para atualizar
    if (forms.tcr.type === 'create' || !forms.tcr.updateItem) return null;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 3,
                minHeight: 500,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    padding: 4,
                    maxWidth: 400,
                    borderRadius: 1,
                    boxShadow: theme.shadows[24],
                    bgcolor: theme.palette.mode === "light"
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                }}
            >
                <h1>Atualizar TCR</h1>

                {mutation.isSuccess && (
                    <Alert severity="success" style={{ width: "100%" }}>
                        TCR atualizado com sucesso!
                    </Alert>
                )}

                {mutation.isError && (
                    <Alert severity="error" style={{ width: "100%" }}>
                        Ocorreu um erro ao atualizar o TCR. Tente novamente.
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
                            {mutation.isPending ? "Atualizando..." : "Atualizar TCR"}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
