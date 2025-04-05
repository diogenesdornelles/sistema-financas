import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { createTcpSchema } from '../../../../packages/validators/zod-schemas/create/create-tcp.validator';
import { updateTcpSchema } from '../../../../packages/validators/zod-schemas/update/update-tcp.validator';
import { usePostTcp, usePutTcp } from '../../hooks/use-tcp';
import { JSX } from 'react';
import { useFormStore } from '../../hooks/use-form-store';
import FormContainer from './templates/form-container';
import ButtonUpdateForm from './templates/button-update-form';

type CreateTcpFormData = z.infer<typeof createTcpSchema>;
type UpdateTcpFormData = z.infer<typeof updateTcpSchema>;

export function CreateTcpForm(): JSX.Element | null {
    const mutation = usePostTcp();
    const { forms } = useFormStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateTcpFormData>({
        resolver: zodResolver(createTcpSchema),
        defaultValues: {
            name: ''
          }
    });

    // Exibe o formulário de criação somente se o modo não for 'update'
    if (forms.tcp.type === 'update') return null;

    const onSubmit = async (data: CreateTcpFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (err) {
            console.error("Erro ao criar Tipo de conta:", err);
        }
    };

    return (
        <FormContainer>
            <Typography variant="h4">Novo Tipo de conta a pagar</Typography>
            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Tipo de conta a paga criado com sucesso!
                </Alert>
            )}

            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao criar o Tipo de conta a paga. Tente novamente.
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

export function UpdateTcpForm(): JSX.Element | null {
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
            console.error("Erro ao atualizar o Tipo de conta a paga:", err);
        }
    };

    // Exibe este formulário somente se o modo for 'update' e houver dados para atualizar
    if (forms.tcp.type === 'create' || !forms.tcp.updateItem) return null;

    return (
        <FormContainer>
            <ButtonUpdateForm title="Atualizar Tipo de conta a paga" name='tcp'/>

            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Tipo de conta a paga atualizado com sucesso!
                </Alert>
            )}

            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao atualizar o Tipo de conta a paga. Tente novamente.
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
