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
import { createTxSchema } from "../../../../packages/validators/zod-schemas/create/create-tx.validator";
import { updateTxSchema } from "../../../../packages/validators/zod-schemas/update/update-tx.validator";
import { usePostTx, usePutTx } from "../../hooks/use-tx";
import { useGetAllCf } from "../../hooks/use-cf";
import { useGetAllCat } from "../../hooks/use-cat";
import ErrorAlert from "../alerts/error-alert";
import { useAuth } from "../../hooks/use-auth";
import FormContainer from "./templates/form-container";
import ButtonUpdateForm from "./templates/button-update-form";
import { strToPtBrMoney } from "../../utils/strToPtBrMoney";
import { TransactionType } from "../../../../packages/dtos/utils/enums";
// ajuste o caminho conforme necessário

// Tipos inferidos dos schemas
type CreateTxFormData = z.infer<typeof createTxSchema>;
type UpdateTxFormData = z.infer<typeof updateTxSchema>;

/* 
  Formulário de Criação de Tx
  Exibido quando o contexto indicar o modo "create"
*/
export function CreateTxForm(): JSX.Element | null | string {
    const mutation = usePostTx();
    const { forms } = useFormStore();
    const { isPending: isPendingCf, error: errorCf, data: cfData } = useGetAllCf();
    const { isPending: isPendingCat, error: errorCat, data: catData } = useGetAllCat();

    // Opções estáticas para o campo "type" baseadas no TransactionType
    const transactionTypeOptions = [
        { id: TransactionType.ENTRY, label: "Entrada" },
        { id: TransactionType.OUTFLOW, label: "Saída" },
    ];

    const { session } = useAuth();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CreateTxFormData>({
        resolver: zodResolver(createTxSchema),
        mode: "onSubmit",
        defaultValues: {
            value: "",
            type: undefined,
            cf: "",
            description: "",
            category: "",
            obs: "",
            tdate: "",
            user: session ? session.user.id : "",
        },
    });

    const onSubmit = async (data: CreateTxFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (err) {
            console.error("Erro ao criar Transação:", err);
        }
    };

    if (forms.tx.type === "update") return null;
    if (isPendingCf || isPendingCat) return "Carregando...";
    if (errorCf || errorCat) {
        const errorMessage = errorCf?.message || errorCat?.message;
        return <ErrorAlert message={errorMessage ? errorMessage : "Ocorreu um erro!"} />;
    }

    return (
        <FormContainer>
            <Typography variant="h4">Nova Transação</Typography>

            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Transação criada com sucesso!
                </Alert>
            )}

            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao criar a Transação. Tente novamente.
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box sx={{ display: 'flex', columnGap: 2 }}>
                        <Controller
                            name="value"
                            
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Valor (R$)"
                                    variant="outlined"
                                    sx={{width: '100%'}}
                                    error={!!errors.value}
                                    helperText={errors.value?.message}
                                    onChange={(e) => {
                                        const formatted = strToPtBrMoney(e.target.value);
                                        field.onChange(formatted);
                                    }}
                                />
                            )}
                        />
                        <TextField
                            label="Data da Transação"
                            {...register("tdate")}
                            sx={{width: '100%'}}
                            variant="outlined"
                            error={!!errors.tdate}
                            helperText={errors.tdate?.message}
                            type="date"
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                        />

                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 2, width: '100%' }}>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    sx={{ flex: 1, width: '100%' }}
                                    options={transactionTypeOptions}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(_, data) => field.onChange(data ? data.id : "")}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Tipo"
                                            variant="outlined"
                                            error={!!errors.type}
                                            helperText={errors.type?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    sx={{ flex: 1, width: '100%' }}
                                    options={catData}
                                    getOptionLabel={(option) => option.name || ""}
                                    onChange={(_, data) => field.onChange(data ? data.id : "")}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Categoria"
                                            variant="outlined"
                                            error={!!errors.category}
                                            helperText={errors.category?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Box>

                    <Controller
                        name="cf"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={cfData}
                                getOptionLabel={(option) => option.number || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Conta"
                                        variant="outlined"
                                        error={!!errors.cf}
                                        helperText={errors.cf?.message}
                                    />
                                )}
                            />
                        )}
                    />

                    <TextField
                        label="Descrição"
                        {...register("description")}
                        variant="outlined"
                        error={!!errors.description}
                        helperText={errors.description?.message}
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
                        {mutation.isPending ? "Enviando..." : "Criar Transação"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}

/* 
  Formulário de Atualização de Tx
  Exibido quando o contexto indicar o modo "update" e houver item para atualizar
*/
export function UpdateTxForm(): JSX.Element | null | string {
    const mutation = usePutTx();
    const { forms } = useFormStore();
    const { isPending: isPendingCf, error: errorCf, data: cfData } = useGetAllCf();
    const { isPending: isPendingCat, error: errorCat, data: catData } = useGetAllCat();

    const transactionTypeOptions = [
        { id: TransactionType.ENTRY, label: "Entrada" },
        { id: TransactionType.OUTFLOW, label: "Saída" },
    ];

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<UpdateTxFormData>({
        resolver: zodResolver(updateTxSchema),
        defaultValues: {
            ...forms.tx.updateItem,
            value: strToPtBrMoney(forms.tx.updateItem?.value || ""),
        },
    });

    const statusValue = watch("status");

    const onSubmit = async (data: UpdateTxFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (err) {
            console.error("Erro ao atualizar Transação:", err);
        }
    };

    if (forms.tx.type === "create" || !forms.tx.updateItem) return null;
    if (isPendingCf || isPendingCat) return "Carregando...";
    if (errorCf || errorCat) {
        const errorMessage = errorCf?.message || errorCat?.message;
        return "Ocorreu um erro: " + errorMessage;
    }

    return (
        <FormContainer>
            <ButtonUpdateForm name="tx" title="Atualizar Transação" />
            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Transação atualizada com sucesso!
                </Alert>
            )}
            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao atualizar a Transação. Tente novamente.
                </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 2, width: '100%' }}>
                        <Controller
                            name="value"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Valor (R$)"
                                    variant="outlined"
                                    error={!!errors.value}
                                    helperText={errors.value?.message}
                                    onChange={(e) => {
                                        const formatted = strToPtBrMoney(e.target.value);
                                        field.onChange(formatted);
                                    }}
                                />
                            )}
                        />
                        <TextField
                            label="Data da Transação"
                            {...register("tdate")}
                            variant="outlined"
                            error={!!errors.tdate}
                            helperText={errors.tdate?.message}
                            type="date"
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', columnGap: 2, width: '100%' }}>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    options={transactionTypeOptions}
                                    sx={{ flex: 1, width: '100%' }}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(_, data) => field.onChange(data ? data.id : "")}
                                    defaultValue={
                                        transactionTypeOptions.find(
                                            (option) => option.id === forms.tx.updateItem?.type
                                        ) || null
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Tipo"
                                            variant="outlined"
                                            error={!!errors.type}
                                            helperText={errors.type?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    options={catData}
                                    getOptionLabel={(option) => option.name || ""}
                                    onChange={(_, data) => field.onChange(data ? data.id : "")}
                                    defaultValue={
                                        catData.find(
                                            (option) => option.id === forms.tx.updateItem?.category
                                        ) || null
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Categoria"
                                            variant="outlined"
                                            error={!!errors.category}
                                            helperText={errors.category?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Box>
                    <Controller
                        name="cf"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={cfData}
                                getOptionLabel={(option) => option.number || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                defaultValue={
                                    cfData.find(
                                        (option) => option.id === forms.tx.updateItem?.cf
                                    ) || null
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Conta"
                                        variant="outlined"
                                        error={!!errors.cf}
                                        helperText={errors.cf?.message}
                                    />
                                )}
                            />
                        )}
                    />
                    <TextField
                        label="Descrição"
                        {...register("description")}
                        variant="outlined"
                        error={!!errors.description}
                        helperText={errors.description?.message}
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
                        {mutation.isPending ? "Atualizando..." : "Atualizar Transação"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}
