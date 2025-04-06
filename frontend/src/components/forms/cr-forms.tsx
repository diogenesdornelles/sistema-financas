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
import { createCrSchema } from "../../../../packages/validators/zod-schemas/create/create-cr.validator";
import { updateCrSchema } from "../../../../packages/validators/zod-schemas/update/update-cr.validator";
import { usePostCr, usePutCr } from "../../hooks/use-cr";
import { useGetAllTcr } from "../../hooks/use-tcr";
import { useGetAllPartner } from "../../hooks/use-partner";
import { useGetAllTx } from "../../hooks/use-tx";
import ErrorAlert from "../alerts/error-alert";
import { useAuth } from "../../hooks/use-auth";
import FormContainer from "./templates/form-container";
import ButtonUpdateForm from "./templates/button-update-form";
import { strToPtBrMoney } from "../../utils/strToPtBrMoney";

// Tipos inferidos dos schemas
type CreateCrFormData = z.infer<typeof createCrSchema>;
type UpdateCrFormData = z.infer<typeof updateCrSchema>;

/* 
  Formulário de Criação de Cr
  Exibido quando o contexto indicar o modo "create"
*/
export function CreateCrForm(): JSX.Element | null | string {
    const mutation = usePostCr();
    const { forms } = useFormStore();
    const { isPending: isPendingTcr, error: errorTcr, data: tcrData } = useGetAllTcr();
    const { isPending: isPendingPartner, error: errorPartner, data: partnerData } = useGetAllPartner();
    const { isPending: isPendingTx, error: errorTx, data: txData } = useGetAllTx();
    const { session } = useAuth();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CreateCrFormData>({
        resolver: zodResolver(createCrSchema),
        mode: "onSubmit",
        defaultValues: {
            value: "",
            type: "",
            customer: "",
            due: "",
            obs: "",
            user: session ? session.user.id : "",
            tx: undefined,
        },
    });

    const onSubmit = async (data: CreateCrFormData) => {
        try {
            await mutation.mutateAsync({
                ...data,
                tx: data.tx ? data.tx : undefined
            });
        } catch (err) {
            console.error("Erro ao criar Conta:", err);
        }
    };

    if (forms.cr.type === "update") return null;
    if (isPendingTcr || isPendingPartner || isPendingTx) return "Carregando...";
    if (errorTcr || errorPartner || errorTx) {
        const errorMessage = errorTcr?.message || errorPartner?.message || errorTx?.message;
        return <ErrorAlert message={errorMessage ? errorMessage : "Ocorreu um erro!"} />;
    }

    return (
        <FormContainer>
            <Typography variant="h4">Nova Conta a Receber</Typography>

            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Conta criada com sucesso!
                </Alert>
            )}

            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao criar a Conta. Tente novamente.
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
                                    sx={{width: '100%'}}
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
                            label="Vencimento"
                            {...register("due")}
                            variant="outlined"
                            error={!!errors.due}
                            sx={{width: '100%'}}
                            helperText={errors.due?.message}
                            type="date"
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', columnGap: 2 }}>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    options={tcrData}
                                    sx={{ flex: 1, width: '100%' }}
                                    getOptionLabel={(option) => option.name || ""}
                                    onChange={(_, data) => field.onChange(data ? data.id : "")}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Tipo (Tcr)"
                                            variant="outlined"
                                            error={!!errors.type}
                                            helperText={errors.type?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                        <Controller
                            name="tx"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    options={txData}
                                    sx={{ flex: 1 }}
                                    getOptionLabel={(option) => option.description || ""}
                                    onChange={(_, data) => field.onChange(data ? data.id : "")}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Transação"
                                            variant="outlined"
                                            error={!!errors.tx}
                                            helperText={errors.tx?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Box>

                    <Controller
                        name="customer"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={partnerData}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Cliente"
                                        variant="outlined"
                                        error={!!errors.customer}
                                        helperText={errors.customer?.message}
                                    />
                                )}
                            />
                        )}
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
                        {mutation.isPending ? "Enviando..." : "Criar Conta"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}

/* 
  Formulário de Atualização de Cr
  Exibido quando o contexto indicar o modo "update" e houver item para atualizar
*/
export function UpdateCrForm(): JSX.Element | null | string {
    const mutation = usePutCr();
    const { forms } = useFormStore();
    const { isPending: isPendingTcr, error: errorTcr, data: tcrData } = useGetAllTcr();
    const { isPending: isPendingPartner, error: errorPartner, data: partnerData } = useGetAllPartner();
    const { isPending: isPendingTx, error: errorTx, data: txData } = useGetAllTx();

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<UpdateCrFormData>({
        resolver: zodResolver(updateCrSchema),
        defaultValues: {
            ...forms.cr.updateItem,
            value: strToPtBrMoney(forms.cr.updateItem?.value || ""),
        },
    });

    const statusValue = watch("status");

    const onSubmit = async (data: UpdateCrFormData) => {
        try {
            await mutation.mutateAsync({
                ...data,
                tx: data.tx ? data.tx : undefined
            });
        } catch (err) {
            console.error("Erro ao atualizar a Conta:", err);
        }
    };

    if (forms.cr.type === "create" || !forms.cr.updateItem) return null;
    if (isPendingTcr || isPendingPartner || isPendingTx) return "Carregando...";
    if (errorTcr || errorPartner || errorTx) {
        const errorMessage = errorTcr?.message || errorPartner?.message || errorTx?.message;
        return "Ocorreu um erro: " + errorMessage;
    }

    return (
        <FormContainer>
            <ButtonUpdateForm name="cr" title="Atualizar Conta a Receber" />
            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Conta atualizada com sucesso!
                </Alert>
            )}
            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao atualizar a Conta. Tente novamente.
                </Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={tcrData}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                defaultValue={
                                    tcrData.find((option) => option.id === forms.cr.updateItem?.type) || null
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tipo (Tcr)"
                                        variant="outlined"
                                        error={!!errors.type}
                                        helperText={errors.type?.message}
                                    />
                                )}
                            />
                        )}
                    />
                    <Controller
                        name="customer"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={partnerData}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                defaultValue={
                                    partnerData.find((option) => option.id === forms.cr.updateItem?.customer) || null
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Cliente"
                                        variant="outlined"
                                        error={!!errors.customer}
                                        helperText={errors.customer?.message}
                                    />
                                )}
                            />
                        )}
                    />
                    <TextField
                        label="Vencimento"
                        {...register("due")}
                        variant="outlined"
                        error={!!errors.due}
                        helperText={errors.due?.message}
                        type="date"
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
                    />
                    {/* Campo para Data de Recebimento (rdate) */}
                    <TextField
                        label="Data de Recebimento"
                        {...register("rdate")}
                        variant="outlined"
                        error={!!errors.rdate}
                        helperText={errors.rdate?.message}
                        type="date"
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}
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
                    <Controller
                        name="tx"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={txData}
                                getOptionLabel={(option) => option.description || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                defaultValue={
                                    txData.find((option) => option.id === forms.cr.updateItem?.tx) || null
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Transação"
                                        variant="outlined"
                                        error={!!errors.tx}
                                        helperText={errors.tx?.message}
                                    />
                                )}
                            />
                        )}
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
                        {mutation.isPending ? "Atualizando..." : "Atualizar Conta"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}
