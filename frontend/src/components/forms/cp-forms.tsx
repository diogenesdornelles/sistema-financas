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
import { createCpSchema } from "../../../../packages/validators/zod-schemas/create/create-cp.validator";
import { updateCpSchema } from "../../../../packages/validators/zod-schemas/update/update-cp.validator";
import { usePostCp, usePutCp } from "../../hooks/use-cp";
import { useGetAllTcp } from "../../hooks/use-tcp";
import { useGetAllPartner } from "../../hooks/use-partner";
import { useGetAllTx } from "../../hooks/use-tx";
import ErrorAlert from "../alerts/error-alert";
import { useAuth } from "../../hooks/use-auth";
import FormContainer from "./templates/form-container";
import ButtonUpdateForm from "./templates/button-update-form";
import { strToPtBrMoney } from "../../utils/strToPtBrMoney";

// Tipos inferidos dos schemas
type CreateCpFormData = z.infer<typeof createCpSchema>;
type UpdateCpFormData = z.infer<typeof updateCpSchema>;

/* 
  Formulário de Criação de Cp
  Exibido quando o contexto indicar o modo "create"
*/
export function CreateCpForm(): JSX.Element | null | string {
    const mutation = usePostCp();
    const { forms } = useFormStore();
    const { isPending: isPendingTcp, error: errorTcp, data: tcpData } = useGetAllTcp();
    const { isPending: isPendingPartner, error: errorPartner, data: partnerData } = useGetAllPartner();
    const { isPending: isPendingTx, error: errorTx, data: txData } = useGetAllTx();
    const { session } = useAuth();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CreateCpFormData>({
        resolver: zodResolver(createCpSchema),
        mode: "onSubmit",
        defaultValues: {
            value: "",
            type: "",
            supplier: "",
            due: "", // data atual
            obs: "",
            user: session ? session.user.id : "",
            tx: undefined,
        },
    });

    const onSubmit = async (data: CreateCpFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (err) {
            console.error("Erro ao criar Conta:", err);
        }
    };

    if (forms.cp.type === "update") return null;
    if (isPendingTcp || isPendingPartner || isPendingTx) return "Carregando...";
    if (errorTcp || errorPartner || errorTx) {
        const errorMessage = errorTcp?.message || errorPartner?.message || errorTx?.message;
        return <ErrorAlert message={errorMessage ? errorMessage : 'Ocorreu um erro!'} />;
    }

    return (
        <FormContainer>
            <Typography variant="h4">Nova Conta a Pagar</Typography>

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
                            label="Vencimento"
                            {...register("due")}
                            variant="outlined"
                            sx={{width: '100%'}}
                            error={!!errors.due}
                            helperText={errors.due?.message}
                            type="date"
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                        />
                    </Box>
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={tcpData}
                                getOptionLabel={(option) => option.name || ""}
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

                    {/* Fornecedor (Autocomplete de Partner) */}
                    <Controller
                        name="supplier"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={partnerData}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Fornecedor"
                                        variant="outlined"
                                        error={!!errors.supplier}
                                        helperText={errors.supplier?.message}
                                    />
                                )}
                            />
                        )}
                    />

                    {/* Data de Vencimento */}


                    {/* Observações */}
                    <TextField
                        label="Observações"
                        {...register("obs")}
                        variant="outlined"
                        error={!!errors.obs}
                        helperText={errors.obs?.message}
                        multiline
                        rows={3}
                    />

                    {/* Transação (Autocomplete de Tx) */}
                    <Controller
                        name="tx"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={txData}
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
  Formulário de Atualização de Cp
  Exibido quando o contexto indicar o modo "update" e houver item para atualizar
*/
export function UpdateCpForm(): JSX.Element | null | string {
    const mutation = usePutCp();
    const { forms } = useFormStore();
    const { isPending: isPendingTcp, error: errorTcp, data: tcpData } = useGetAllTcp();
    const { isPending: isPendingPartner, error: errorPartner, data: partnerData } = useGetAllPartner();
    const { isPending: isPendingTx, error: errorTx, data: txData } = useGetAllTx();

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<UpdateCpFormData>({
        resolver: zodResolver(updateCpSchema),
        defaultValues: {
            ...forms.cp.updateItem,
            value: strToPtBrMoney(forms.cp.updateItem?.value || ""),
        },
    });

    const statusValue = watch("status");

    const onSubmit = async (data: UpdateCpFormData) => {
        try {
            await mutation.mutateAsync(data);
        } catch (err) {
            console.error("Erro ao atualizar Conta:", err);
        }
    };

    if (forms.cp.type === "create" || !forms.cp.updateItem) return null;
    if (isPendingTcp || isPendingPartner || isPendingTx) return "Carregando...";
    if (errorTcp || errorPartner || errorTx) {
        const errorMessage = errorTcp?.message || errorPartner?.message || errorTx?.message;
        return "Ocorreu um erro: " + errorMessage;
    }

    return (
        <FormContainer>
            <ButtonUpdateForm name="cp" title="Atualizar Conta a Pagar" />
            {mutation.isSuccess && (
                <Alert severity="success" style={{ width: "100%" }}>
                    Conta atualizada com sucesso!
                </Alert>
            )}
            {mutation.isError && (
                <Alert severity="error" style={{ width: "100%" }}>
                    Ocorreu um erro ao atualizar o Conta. Tente novamente.
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
                                options={tcpData}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                defaultValue={
                                    tcpData.find(
                                        (option) => option.id === forms.cp.updateItem?.type
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
                        name="supplier"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={partnerData}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                defaultValue={
                                    partnerData.find(
                                        (option) => option.id === forms.cp.updateItem?.supplier
                                    ) || null
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Fornecedor"
                                        variant="outlined"
                                        error={!!errors.supplier}
                                        helperText={errors.supplier?.message}
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
                    <TextField
                        label="Data de Pagamento"
                        {...register("pdate")}
                        variant="outlined"
                        error={!!errors.pdate}
                        helperText={errors.pdate?.message}
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
                                    txData.find(
                                        (option) => option.id === forms.cp.updateItem?.tx
                                    ) || null
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
                        {mutation.isPending ? "Atualizando..." : "Atualizar Cp"}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
}
