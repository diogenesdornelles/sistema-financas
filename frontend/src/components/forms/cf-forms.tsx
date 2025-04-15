import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    TextField,
    Button,
    Box,
    Alert,
    Autocomplete,
    Checkbox,
    FormControlLabel,
    Typography,
} from "@mui/material";
import { JSX } from "react";
import { useFormStore } from "../../hooks/use-form-store";
import { createCfSchema } from "../../../../packages/validators/zod-schemas/create/create-cf.validator";
import { updateCfSchema } from "../../../../packages/validators/zod-schemas/update/update-cf.validator";
import { usePostCf, usePutCf } from "../../hooks/use-cf";
import { useGetAllTcf } from "../../hooks/use-tcf";
import ErrorAlert from "../alerts/error-alert";
import { useAuth } from "../../hooks/use-auth";
import FormContainer from './templates/form-container';
import ButtonUpdateForm from "./templates/button-update-form";
import { strToPtBrMoney } from '../../utils/strToPtBrMoney'
import CustomBackdrop from "../custom-backdrop";

// Tipos inferidos dos schemas
type CreateCfFormData = z.infer<typeof createCfSchema>;
type UpdateCfFormData = z.infer<typeof updateCfSchema>;

/* 
  Formulário de Criação de Cf 
  Exibido quando o contexto indicar o modo "create"
*/
export function CreateCfForm(): JSX.Element | null {
    const mutation = usePostCf();
    const { forms } = useFormStore();
    const { isPending, error, data } = useGetAllTcf();
    const { session } = useAuth()

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CreateCfFormData>({
        resolver: zodResolver(createCfSchema),
        mode: 'onSubmit',
        defaultValues: {
            number: '',
            balance: '',
            user: session ? session?.user.id : '',
            bank: '',
            ag: '',
            type: '',
            obs: ''
        }
    });

    const onSubmit = async (data: CreateCfFormData) => {
        try {
            await mutation.mutateAsync(data);
            reset()
        } catch (err) {
            console.error("Erro ao criar Conta:", err);
        }
    };

    if (forms.cf.type === "update") return null;

    if (error) return <ErrorAlert message={error.message} />

    return (
        <FormContainer formName='cf'>
            <Typography variant="h4">Nova Conta Financeira</Typography>

            {isPending && <CustomBackdrop isOpen={mutation.isPending} />}

            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Conta criada com sucesso!
                </Alert>
            )}

            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao criar o Conta. Tente novamente.
                </Alert>
            )}

            {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", minWidth: 500 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                        <TextField
                            label="Número"
                            {...register("number")}
                            variant="outlined"
                            error={!!errors.number}
                            helperText={errors.number?.message}
                            size="small"
                            sx={{ width: '100%' }}
                        />
                        <Controller
                            name="balance"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    // type="number"     
                                    label="Saldo(R$)"
                                    size="small"
                                    variant="outlined"
                                    sx={{ width: '100%' }}
                                    error={!!errors.balance}
                                    helperText={errors.balance?.message}
                                    onChange={(e) => {
                                        const formatedValue = strToPtBrMoney(e.target.value);
                                        field.onChange(formatedValue);
                                    }}
                                />
                            )}
                        />

                    </Box>

                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={data ? data : []}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) =>
                                    field.onChange(data ? data.id : "")
                                }
                                value={field.value ? (data?.find((option) => option.id === field.value) || null) : null}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tipo"
                                        variant="outlined"
                                        size="small"
                                        error={!!errors.type}
                                        helperText={errors.type?.message}
                                    />
                                )}
                            />
                        )}
                    />


                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                        <TextField
                            label="Agência"
                            size="small"
                            {...register("ag")}
                            variant="outlined"
                            error={!!errors.ag}
                            helperText={errors.ag?.message}
                        />

                        <TextField
                            label="Banco"
                            size="small"
                            {...register("bank")}
                            variant="outlined"
                            error={!!errors.bank}
                            helperText={errors.bank?.message}
                        />
                    </Box>

                    <TextField
                        label="Observações"
                        {...register("obs")}
                        size="small"
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
                        {mutation.isPending ? "Enviando..." : "Criar Conta"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}

/* 
  Formulário de Atualização de Cf 
  Exibido quando o contexto indicar o modo "update" e houver dados para atualização
*/
export function UpdateCfForm(): JSX.Element | null {
    const { forms } = useFormStore();
    const mutation = usePutCf(forms.cf.updateItem ? forms.cf.updateItem.id : '');
    const { isPending, error, data } = useGetAllTcf();



    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<UpdateCfFormData>({
        resolver: zodResolver(updateCfSchema),
        defaultValues: forms.cf.updateItem ? {
            number: forms.cf.updateItem.number,
            type: forms.cf.updateItem.type,
            ag: forms.cf.updateItem.ag || undefined,
            bank: forms.cf.updateItem.bank || undefined,
            obs: forms.cf.updateItem.obs || undefined,
            status: forms.cf.updateItem.status,
            balance: strToPtBrMoney(forms.cf.updateItem?.balance ?? '')
        } : {},
    });

    const statusValue = watch("status");

    const onSubmit = async (data: UpdateCfFormData) => {
        try {
            await mutation.mutateAsync(data);
            reset({
                number: data.number,
                type: data.type,
                ag: data.ag || undefined,
                bank: data.bank || undefined,
                obs: data.obs || undefined,
                status: data.status,
                balance: strToPtBrMoney(data.balance ?? '')
            })
        } catch (err) {
            console.error("Erro ao atualizar Conta:", err);
        }
    };

    // Exibe apenas se o formStore estiver em modo update e houver item para atualizar
    if (forms.cf.type === "create" || !forms.cf.updateItem) return null;

    if (error) return (
        <Alert severity="error" style={{ width: "100%" }}>
            {`'Ocorreu um erro: ' + ${error.message}`}
        </Alert>
    )

    return (
        <FormContainer formName='cf'>
            <ButtonUpdateForm name="cf" title="Atualizar Conta Financeira" />

            {isPending && <CustomBackdrop isOpen={true} />}
            
            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Conta atualizado com sucesso!
                </Alert>
            )}

            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao atualizar o Conta. Tente novamente.
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", minWidth: 500 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                        <TextField
                            label="Número"
                            {...register("number")}
                            variant="outlined"
                            error={!!errors.number}
                            helperText={errors.number?.message}
                            sx={{ width: '100%' }}
                            size="small"
                        />
                        <TextField
                            label="Saldo(R$)"
                            {...register("balance")}
                            variant="outlined"
                            error={!!errors.balance}
                            helperText={errors.balance?.message}
                            type="text"
                            sx={{ width: '100%' }}
                            size="small"
                        />
                    </Box>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={data ? data : []}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) =>
                                    field.onChange(data ? data.id : "")
                                }
                                defaultValue={
                                    data && data.find(
                                        (option) =>
                                            option.id === forms.cf.updateItem?.type
                                    ) || null
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tipo"
                                        variant="outlined"
                                        error={!!errors.type}
                                        helperText={errors.type?.message}
                                        size="small"
                                    />
                                )}
                            />
                        )}
                    />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                        <TextField
                            label="Agência"
                            {...register("ag")}
                            variant="outlined"
                            error={!!errors.ag}
                            helperText={errors.ag?.message}
                            size="small"
                        />

                        <TextField
                            label="Banco"
                            {...register("bank")}
                            variant="outlined"
                            error={!!errors.bank}
                            helperText={errors.bank?.message}
                            size="small"
                        />
                    </Box>

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
                        {mutation.isPending ? "Atualizando..." : "Atualizar Conta"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}
