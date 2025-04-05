import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Alert, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { JSX } from 'react';
import { useFormStore } from '../../hooks/use-form-store';
import { createPartnerSchema } from '../../../../packages/validators/zod-schemas/create/create-partner.validator';
import { updatePartnerSchema } from '../../../../packages/validators/zod-schemas/update/update-partner.validator';
import { usePostPartner, usePutPartner } from '../../hooks/use-partner';
import { useAuth } from '../../hooks/use-auth';
import FormContainer from './templates/form-container';
import ButtonUpdateForm from './templates/button-update-form';

type CreatePartnerFormData = z.infer<typeof createPartnerSchema>;
type UpdatePartnerFormData = z.infer<typeof updatePartnerSchema>;


export function CreatePartnerForm(): JSX.Element | null {
    const mutation = usePostPartner();
    const { forms } = useFormStore();
    const { session } = useAuth()

    const { register, handleSubmit, formState: { errors } } = useForm<CreatePartnerFormData>({
        resolver: zodResolver(createPartnerSchema),
        defaultValues: {
            name: '',
            cod: '',
            user: session ? session?.user.id : '',
            obs: undefined,
            type: undefined
        }
        
    });

    const onSubmit = async (data: CreatePartnerFormData) => {
        try {
            await mutation.mutateAsync({ ...data, user: session ? session?.user.id : '' });
        } catch (err) {
            console.error("Erro ao criar parceiro:", err);
        }
    };

    if (forms.partner.type === 'update') return null;

    return (
        <FormContainer>
            <Typography variant="h4">Novo Parceiro</Typography>

            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Parceiro criado com sucesso!
                </Alert>
            )}

            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao criar o Parceiro. Tente novamente.
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

                    <FormControl variant="outlined" error={!!errors.type}>
                        <InputLabel id="partner-type-label">Tipo</InputLabel>
                        <Select
                            labelId="partner-type-label"
                            label="Tipo"
                            defaultValue=""
                            {...register("type")}
                        >
                            <MenuItem value="PF">PF</MenuItem>
                            <MenuItem value="PJ">PJ</MenuItem>
                        </Select>
                        {errors.type && (
                            <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>
                                {errors.type.message}
                            </p>
                        )}
                    </FormControl>

                    <TextField
                        label="Código (CPF/CNPJ)"
                        {...register("cod")}
                        variant="outlined"
                        error={!!errors.cod}
                        helperText={errors.cod?.message}
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

                    <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
                        {mutation.isPending ? "Enviando..." : "Criar Parceiro"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}


export function UpdatePartnerForm(): JSX.Element | null {
    const mutation = usePutPartner();
    const { forms } = useFormStore();



    const { register, handleSubmit, watch, formState: { errors } } = useForm<UpdatePartnerFormData>({
        resolver: zodResolver(updatePartnerSchema),
        defaultValues: forms.partner.updateItem || {},
    });

    const statusValue = watch("status");

    const onSubmit = async (data: UpdatePartnerFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (err) {
            console.error("Erro ao atualizar Parceiro:", err);
        }
    };

    if (forms.partner.type === 'create' || !forms.partner.updateItem) return null;

    return (
        <FormContainer>
            <ButtonUpdateForm title='Atualizar Parceiro' name='partner'/>

            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Parceiro atualizado com sucesso!
                </Alert>
            )}

            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao atualizar o Parceiro. Tente novamente.
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

                    <FormControl variant="outlined" error={!!errors.type}>
                        <InputLabel id="partner-type-label-update">Tipo</InputLabel>
                        <Select
                            labelId="partner-type-label-update"
                            label="Tipo"
                            defaultValue=""
                            {...register("type")}
                        >
                            <MenuItem value="PF">PF</MenuItem>
                            <MenuItem value="PJ">PJ</MenuItem>
                        </Select>
                        {errors.type && (
                            <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>
                                {errors.type.message}
                            </p>
                        )}
                    </FormControl>

                    <TextField
                        label="Código"
                        {...register("cod")}
                        variant="outlined"
                        error={!!errors.cod}
                        helperText={errors.cod?.message}
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

                    <Button type="submit" variant="contained" color="primary" disabled={mutation.isPending}>
                        {mutation.isPending ? "Atualizando..." : "Atualizar Parceiro"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}
