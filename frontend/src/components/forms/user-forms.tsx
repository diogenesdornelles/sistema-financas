import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { Checkbox, FormControlLabel } from '@mui/material';
import { createUserRepPwdSchema } from '../../../../packages/validators/zod-schemas/create/create-user-rep-pwd.validator';
import { updateUserSchema } from '../../../../packages/validators/zod-schemas/update/update-user.validator';
import { usePostUser, usePutUser } from '../../hooks/use-user';
import { JSX } from 'react';
import { useFormStore } from '../../hooks/use-form-store';

type CreateUserFormData = z.infer<typeof createUserRepPwdSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export function CreateUserForm(): JSX.Element | null {
    const theme = useTheme();
    const mutation = usePostUser();
    const { forms } = useFormStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserRepPwdSchema),
    });

    const onSubmit = async (data: CreateUserFormData) => {
        // Removemos o campo "confirmPwd" antes de enviar os dados
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPwd, ...payload } = data;
        try {
            await mutation.mutateAsync(payload);
        } catch (err) {
            console.error("Erro ao enviar o formulário:", err);
        }
    };
    // Exibe o formulário de criação somente se o formStore indicar modo "create"
    if (forms.user.type === 'update') return null;

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
                <h1>Novo Usuário</h1>

                {mutation.isSuccess && (
                    <Alert severity="success" style={{ width: "100%" }}>
                        Usuário criado com sucesso!
                    </Alert>
                )}

                {mutation.isError && (
                    <Alert severity="error" style={{ width: "100%" }}>
                        Ocorreu um erro ao criar o usuário. Tente novamente.
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
                            label="Sobrenome"
                            {...register("surname")}
                            variant="outlined"
                            error={!!errors.surname}
                            helperText={errors.surname?.message}
                        />
                        <TextField
                            label="CPF"
                            {...register("cpf")}
                            variant="outlined"
                            error={!!errors.cpf}
                            helperText={errors.cpf?.message}
                        />
                        <TextField
                            label="Senha"
                            type="password"
                            {...register("pwd")}
                            variant="outlined"
                            error={!!errors.pwd}
                            helperText={errors.pwd?.message}
                        />
                        <TextField
                            label="Repita a Senha"
                            type="password"
                            {...register("confirmPwd")}
                            variant="outlined"
                            error={!!errors.confirmPwd}
                            helperText={errors.confirmPwd?.message}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Enviando..." : "Criar Usuário"}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}

export function UpdateUserForm(): JSX.Element | null {
    const theme = useTheme();
    const mutation = usePutUser();
    const { forms } = useFormStore();



    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: forms.user.updateItem || {},
    });

    const statusValue = watch("status");

    const onSubmit = async (data: UpdateUserFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (err) {
            console.error("Erro ao atualizar o usuário:", err);
        }
    };

    // Exibe este formulário somente se o formStore indicar modo "update" e houver dados para atualizar
    if (forms.user.type === 'create' || !forms.user.updateItem) return null;

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
                <h1>Atualizar Usuário</h1>

                {mutation.isSuccess && (
                    <Alert severity="success" style={{ width: "100%" }}>
                        Usuário atualizado com sucesso!
                    </Alert>
                )}

                {mutation.isError && (
                    <Alert severity="error" style={{ width: "100%" }}>
                        Ocorreu um erro ao atualizar o usuário. Tente novamente.
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
                            label="Sobrenome"
                            {...register("surname")}
                            variant="outlined"
                            error={!!errors.surname}
                            helperText={errors.surname?.message}
                        />
                        <TextField
                            label="CPF"
                            {...register("cpf")}
                            variant="outlined"
                            error={!!errors.cpf}
                            helperText={errors.cpf?.message}
                        />
                        <TextField
                            label="Senha"
                            type="password"
                            {...register("pwd")}
                            variant="outlined"
                            error={!!errors.pwd}
                            helperText={errors.pwd?.message}
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
                            {mutation.isPending ? "Atualizando..." : "Atualizar Usuário"}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
