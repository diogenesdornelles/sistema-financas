import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { Checkbox, FormControlLabel } from '@mui/material';
import { createTcpSchema } from '../../../../packages/validators/zod-schemas/create/create-tcp.validator';
import { updateTcpSchema } from '../../../../packages/validators/zod-schemas/update/update-tcp.validator';
import { usePostTcp, usePutTcp } from '../../hooks/use-tcp';
import { JSX } from 'react';
import { useFormStore } from '../../hooks/use-form-store';

type CreateTcpFormData = z.infer<typeof createTcpSchema>;
type UpdateTcpFormData = z.infer<typeof updateTcpSchema>;

export function CreateTcpForm(): JSX.Element | null {
    const theme = useTheme();
    const mutation = usePostTcp();
    const { forms } = useFormStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateTcpFormData>({
        resolver: zodResolver(createTcpSchema),
    });

    // Exibe o formulário de criação somente se o modo não for 'update'
    if (forms.tcp.type === 'update') return null;

    const onSubmit = async (data: CreateTcpFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (err) {
            console.error("Erro ao criar TCP:", err);
        }
    };

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
                    bgcolor: theme.palette.mode === "light" ? theme.palette.common.white : theme.palette.common.black,
                }}
            >
                <h1>Novo TCP</h1>

                {mutation.isSuccess && (
                    <Alert severity="success" style={{ width: "100%" }}>
                        TCP criado com sucesso!
                    </Alert>
                )}

                {mutation.isError && (
                    <Alert severity="error" style={{ width: "100%" }}>
                        Ocorreu um erro ao criar o TCP. Tente novamente.
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
                            {mutation.isPending ? "Enviando..." : "Criar TCP"}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}

export function UpdateTcpForm(): JSX.Element | null {
    const theme = useTheme();
    const mutation = usePutTcp();
    const { forms } = useFormStore();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<UpdateTcpFormData>({
        resolver: zodResolver(updateTcpSchema),
        defaultValues: forms.tcp.updateItem || {},
    });

    const statusValue = watch("status");

    const onSubmit = async (data: UpdateTcpFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (err) {
            console.error("Erro ao atualizar o TCP:", err);
        }
    };

    // Exibe este formulário somente se o modo for 'update' e houver dados para atualizar
    if (forms.tcp.type === 'create' || !forms.tcp.updateItem) return null;

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
                    bgcolor: theme.palette.mode === "light" ? theme.palette.common.white : theme.palette.common.black,
                }}
            >
                <h1>Atualizar TCP</h1>

                {mutation.isSuccess && (
                    <Alert severity="success" style={{ width: "100%" }}>
                        TCP atualizado com sucesso!
                    </Alert>
                )}

                {mutation.isError && (
                    <Alert severity="error" style={{ width: "100%" }}>
                        Ocorreu um erro ao atualizar o TCP. Tente novamente.
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
                            {mutation.isPending ? "Atualizando..." : "Atualizar TCP"}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
