import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { createUserRepPwdSchema } from '../../../../packages/validators/zod-schemas/create/create-user-rep-pwd.validator';
import { updateUserSchema } from '../../../../packages/validators/zod-schemas/update/update-user.validator';
import { usePostUser, usePutUser } from '../../hooks/use-user';
import { JSX } from 'react';
import { useFormStore } from '../../hooks/use-form-store';
import FormContainer from './templates/form-container';
import ButtonUpdateForm from './templates/button-update-form';
import CustomBackdrop from '../custom-backdrop';

type CreateUserFormData = z.infer<typeof createUserRepPwdSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export function CreateUserForm(): JSX.Element | null {
    const mutation = usePostUser();
    const { forms } = useFormStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserRepPwdSchema),
        defaultValues: {
            name: '',
            surname: '',
            cpf: '',
            pwd: '',
            confirmPwd: ''
        }
    });

    const onSubmit = async (data: CreateUserFormData) => {
        // Removemos o campo "confirmPwd" antes de enviar os dados
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPwd, ...payload } = data;
        try {
            await mutation.mutateAsync(payload);
            reset()
        } catch (err) {
            console.error("Erro ao enviar o formulário:", err);
        }
    };
    // Exibe o formulário de criação somente se o formStore indicar modo "create"
    if (forms.user.type === 'update') return null;

    return (
        <FormContainer formName='user'>
            <Typography variant="h4">Novo Usuário</Typography>
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
                        label="Sobrenome"
                        {...register("surname")}
                        variant="outlined"
                        error={!!errors.surname}
                        helperText={errors.surname?.message}
                        size="small"
                    />
                    <TextField
                        label="CPF"
                        {...register("cpf")}
                        variant="outlined"
                        error={!!errors.cpf}
                        helperText={errors.cpf?.message}
                        size="small"
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        {...register("pwd")}
                        variant="outlined"
                        error={!!errors.pwd}
                        size="small"
                        helperText={errors.pwd?.message}
                    />
                    <TextField
                        label="Repita a Senha"
                        type="password"
                        {...register("confirmPwd")}
                        variant="outlined"
                        error={!!errors.confirmPwd}
                        helperText={errors.confirmPwd?.message}
                        size="small"
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
        </FormContainer>
    );
}

export function UpdateUserForm(): JSX.Element | null {
    
    const { forms } = useFormStore();
    const mutation = usePutUser(forms.user.updateItem ? forms.user.updateItem.id : '');


    const {
        register,
        reset,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: forms.user.updateItem ? {
            name: forms.user.updateItem.name,
            surname: forms.user.updateItem.surname,
            cpf: forms.user.updateItem.cpf,
            status: forms.user.updateItem.status,
            pwd: ''
        } : {},
    });

    const statusValue = watch("status");

    const onSubmit = async (data: UpdateUserFormData) => {
        try {
            await mutation.mutateAsync(data);
            reset()
        } catch (err) {
            console.error("Erro ao atualizar o usuário:", err);
        }
    };

    // Exibe este formulário somente se o formStore indicar modo "update" e houver dados para atualizar
    if (forms.user.type === 'create' || !forms.user.updateItem) return null;

    return (
        <FormContainer formName='user'>
            <ButtonUpdateForm title="Atualizar usuário" name='user'/>

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

            {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", minWidth: 500 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Nome"
                        {...register("name")}
                        variant="outlined"
                        size="small"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <TextField
                        label="Sobrenome"
                        {...register("surname")}
                        size="small"
                        variant="outlined"
                        error={!!errors.surname}
                        helperText={errors.surname?.message}
                    />
                    <TextField
                        label="CPF"
                        {...register("cpf")}
                        size="small"
                        variant="outlined"
                        error={!!errors.cpf}
                        helperText={errors.cpf?.message}
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        {...register("pwd")}
                        size="small"
                        variant="outlined"
                        error={!!errors.pwd}
                        helperText={errors.pwd?.message}
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
                        {mutation.isPending ? "Atualizando..." : "Atualizar Usuário"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}
