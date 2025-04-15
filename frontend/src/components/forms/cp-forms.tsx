import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    TextField,
    Button,
    Box,
    Alert,
    Autocomplete,
    Typography,
    InputLabel,
} from "@mui/material";
import { JSX } from "react";
import { useFormStore } from "../../hooks/use-form-store";
import { createCpSchema } from "../../../../packages/validators/zod-schemas/create/create-cp.validator";
import { updateCpSchema } from "../../../../packages/validators/zod-schemas/update/update-cp.validator";
import { usePostCp, usePutCp } from "../../hooks/use-cp";
import { useGetAllTcp } from "../../hooks/use-tcp";
import { useGetAllPartner } from "../../hooks/use-partner";
import ErrorAlert from "../alerts/error-alert";
import { useAuth } from "../../hooks/use-auth";
import FormContainer from "./templates/form-container";
import ButtonUpdateForm from "./templates/button-update-form";
import { strToPtBrMoney } from "../../utils/strToPtBrMoney";
import CustomBackdrop from "../custom-backdrop";

// Tipos inferidos dos schemas
type CreateCpFormData = z.infer<typeof createCpSchema>;
type UpdateCpFormData = z.infer<typeof updateCpSchema>;


/* 
  Formulário de Criação de Cp
  Exibido quando o contexto indicar o modo "create"
*/
export function CreateCpForm(): JSX.Element | null {
    const mutation = usePostCp();
    const { forms } = useFormStore();
    const { isPending: isPendingTcp, error: errorTcp, data: tcpData } = useGetAllTcp();
    const { isPending: isPendingPartner, error: errorPartner, data: partnerData } = useGetAllPartner();
    const { session } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CreateCpFormData>({
        resolver: zodResolver(createCpSchema),
        mode: "onSubmit",
        defaultValues: {
            value: "0,00",
            type: "",
            supplier: "",
            due: "", // data atual
            obs: "",
            user: session ? session.user.id : "",
        },
    });

    const onSubmit = async (data: CreateCpFormData) => {
        try {
            await mutation.mutateAsync(data);
            reset()
        } catch (err) {
            console.error("Erro ao criar Conta:", err);
        }
    };

    if (forms.cp.type === "update") return null;

    if (errorTcp || errorPartner) {
        const errorMessage = errorTcp?.message || errorPartner?.message;
        return <ErrorAlert message={errorMessage ? errorMessage : 'Ocorreu um erro!'} />;
    }

    return (
        <FormContainer formName='cp'>
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

            {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

            {(isPendingTcp || isPendingPartner) && <CustomBackdrop isOpen={mutation.isPending} />}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", minWidth: 500 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box sx={{ display: 'flex', columnGap: 2 }}>
                        <Controller
                            name="value"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Valor (R$)"
                                    size="small"
                                    variant="outlined"
                                    sx={{ width: '100%' }}
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
                            size="small"
                            variant="outlined"
                            sx={{ width: '100%' }}
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
                                options={tcpData ? tcpData : []}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                value={field.value ? (tcpData?.find((option) => option.id === field.value) || null) : null}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tipo"
                                        size="small"
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
                                options={partnerData ? partnerData : []}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                value={field.value ? (partnerData?.find((option) => option.id === field.value) || null) : null}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Fornecedor"
                                        size="small"
                                        variant="outlined"
                                        error={!!errors.supplier}
                                        helperText={errors.supplier?.message}
                                    />
                                )}
                            />
                        )}
                    />
                    <TextField
                        label="Observações"
                        {...register("obs")}
                        variant="outlined"
                        size="small"
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
  Formulário de Atualização de Cp
  Exibido quando o contexto indicar o modo "update" e houver item para atualizar
*/
export function UpdateCpForm(): JSX.Element | null {

    const { forms } = useFormStore();
    const mutation = usePutCp(forms.cp.updateItem ? forms.cp.updateItem.id : '');
    const { isPending: isPendingTcp, error: errorTcp, data: tcpData } = useGetAllTcp();
    const { isPending: isPendingPartner, error: errorPartner, data: partnerData } = useGetAllPartner();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<UpdateCpFormData>({
        resolver: zodResolver(updateCpSchema),
        defaultValues: forms.cp.updateItem ? {
            type: forms.cp.updateItem.type,
            supplier: forms.cp.updateItem.supplier,
            due: String(forms.cp.updateItem.due),
            value: strToPtBrMoney(forms.cp.updateItem?.value || ""),
        } : {},
    });

    const onSubmit = async (data: UpdateCpFormData) => {
        try {
            await mutation.mutateAsync(data);
            reset({
                type: data.type,
                supplier: data.supplier,
                due: String(data.due),
                value: strToPtBrMoney(data.value || ""),
            })
        } catch (err) {
            console.error("Erro ao atualizar Conta:", err);
        }
    };

    if (forms.cp.type === "create" || !forms.cp.updateItem) return null;

    if (errorTcp || errorPartner) {
        const errorMessage = errorTcp?.message || errorPartner?.message;
        return (
            <Alert severity="error" style={{ width: "100%" }}>
                {`'Ocorreu um erro: ' + ${errorMessage}`}
            </Alert>
        )
    }


    return (
        <FormContainer formName='cp'>
            <ButtonUpdateForm name="cp" title="Atualizar Conta a Pagar" />

            {(isPendingTcp || isPendingPartner) && <CustomBackdrop isOpen={true} />}

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

            {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", minWidth: 500 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Controller
                        name="value"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Valor (R$)"
                                variant="outlined"
                                size="small"
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
                                options={tcpData ? tcpData : []}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                defaultValue={
                                    tcpData && tcpData.find(
                                        (option) => option.id === forms.cp.updateItem?.type
                                    ) || null
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tipo"
                                        size="small"
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
                                options={partnerData ? partnerData : []}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                defaultValue={
                                    partnerData && partnerData.find(
                                        (option) => option.id === forms.cp.updateItem?.supplier
                                    ) || null
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Fornecedor"
                                        size="small"
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
                        size="small"
                        variant="outlined"
                        error={!!errors.due}
                        helperText={errors.due?.message}
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
                        size="small"
                        helperText={errors.obs?.message}
                        multiline
                        rows={3}
                    />
                    <InputLabel id="cp-status-label-update">Status</InputLabel>
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
