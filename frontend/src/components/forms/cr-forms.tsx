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
    Select,
    MenuItem,
} from "@mui/material";
import { JSX } from "react";
import { useFormStore } from "../../hooks/use-form-store";
import { createCrSchema } from "../../../../packages/validators/zod-schemas/create/create-cr.validator";
import { updateCrSchema } from "../../../../packages/validators/zod-schemas/update/update-cr.validator";
import { usePostCr, usePutCr } from "../../hooks/use-cr";
import { useGetAllTcr } from "../../hooks/use-tcr";
import { useGetAllPartner } from "../../hooks/use-partner";
import ErrorAlert from "../alerts/error-alert";
import { useAuth } from "../../hooks/use-auth";
import FormContainer from "./templates/form-container";
import ButtonUpdateForm from "./templates/button-update-form";
import { strToPtBrMoney } from "../../utils/strToPtBrMoney";
import CustomBackdrop from "../custom-backdrop";

// Tipos inferidos dos schemas
type CreateCrFormData = z.infer<typeof createCrSchema>;
type UpdateCrFormData = z.infer<typeof updateCrSchema>;

/* 
  Formulário de Criação de Cr
  Exibido quando o contexto indicar o modo "create"
*/
export function CreateCrForm(): JSX.Element | null {
    const mutation = usePostCr();
    const { forms } = useFormStore();
    const { isPending: isPendingTcr, error: errorTcr, data: tcrData } = useGetAllTcr();
    const { isPending: isPendingPartner, error: errorPartner, data: partnerData } = useGetAllPartner();
    const { session } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CreateCrFormData>({
        resolver: zodResolver(createCrSchema),
        mode: "onSubmit",
        defaultValues: {
            value: "0,00",
            type: "",
            customer: "",
            due: "",
            obs: "",
            user: session ? session.user.id : "",
        },
    });

    const onSubmit = async (data: CreateCrFormData) => {
        try {
            await mutation.mutateAsync({
                ...data
            });
            reset()
        } catch (err) {
            console.error("Erro ao criar Conta:", err);
        }
    };

    if (forms.cr.type === "update") return null;

    if (errorTcr || errorPartner ) {
        const errorMessage = errorTcr?.message || errorPartner?.message;
        return <ErrorAlert message={errorMessage ? errorMessage : "Ocorreu um erro!"} />;
    }

    return (
        <FormContainer formName='cr'>
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

            {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

            {(isPendingTcr || isPendingPartner ) && <CustomBackdrop isOpen={mutation.isPending} />}

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
                                    sx={{ width: '100%' }}
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
                        <TextField
                            label="Vencimento"
                            {...register("due")}
                            variant="outlined"
                            error={!!errors.due}
                            size="small"
                            sx={{ width: '100%' }}
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
                                    options={tcrData ? tcrData: []}
                                    sx={{ flex: 1, width: '100%' }}
                                    getOptionLabel={(option) => option.name || ""}
                                    onChange={(_, data) => field.onChange(data ? data.id : "")}
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
                    </Box>

                    <Controller
                        name="customer"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={partnerData ? partnerData : []}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
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
                        size="small"
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
    const { forms } = useFormStore();

    const mutation = usePutCr(forms.cr.updateItem ? forms.cr.updateItem.id : '');
    const { isPending: isPendingTcr, error: errorTcr, data: tcrData } = useGetAllTcr();
    const { isPending: isPendingPartner, error: errorPartner, data: partnerData } = useGetAllPartner();

    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<UpdateCrFormData>({
        resolver: zodResolver(updateCrSchema),
        defaultValues: forms.cr.updateItem ? {
            type: forms.cr.updateItem.type,
            customer: forms.cr.updateItem.customer,
            due: forms.cr.updateItem.due ? String(forms.cr.updateItem.due) : "",
            obs: forms.cr.updateItem.obs ? forms.cr.updateItem.obs : "",
            status: forms.cr.updateItem.status ? forms.cr.updateItem.status : undefined,
            value: strToPtBrMoney(forms.cr.updateItem?.value || ""),
        } : {},
    });

    const statusValue = watch("status");

    const onSubmit = async (data: UpdateCrFormData) => {
        try {
            await mutation.mutateAsync({
                ...data
            });
            reset()
        } catch (err) {
            console.error("Erro ao atualizar a Conta:", err);
        }
    };

    if (forms.cr.type === "create" || !forms.cr.updateItem) return null;

    if (errorTcr || errorPartner ) {
        const errorMessage = errorTcr?.message || errorPartner?.message
        return (
            <Alert severity="error" style={{ width: "100%" }}>
                {`'Ocorreu um erro: ' + ${errorMessage}`}
            </Alert>
        )
    }

    return (
        <FormContainer formName='cr'>
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

            {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

            {(isPendingTcr || isPendingPartner ) && <CustomBackdrop isOpen={true} />}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", minWidth: 500 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Controller
                        name="value"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Valor (R$)"
                                size="small"
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
                                options={tcrData ? tcrData : []}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                defaultValue={
                                    tcrData && tcrData.find((option) => option.id === forms.cr.updateItem?.type) || null
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Tipo (Tcr)"
                                        variant="outlined"
                                        size="small"
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
                                options={partnerData ? partnerData : []}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                defaultValue={
                                    partnerData && partnerData.find((option) => option.id === forms.cr.updateItem?.customer) || null
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Cliente"
                                        variant="outlined"
                                        size="small"
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
                        size="small"
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
                        size="small"
                        error={!!errors.obs}
                        helperText={errors.obs?.message}
                        multiline
                        rows={3}
                    />
                   <InputLabel id="cr-status-label-update">Tipo</InputLabel>
                    <Select
                        labelId="cr-status-label-update"
                        label="Status"
                        size="small"
                        defaultValue={statusValue}
                        {...register("status")}
                    >
                        <MenuItem value="pending">Pendente</MenuItem>
                        <MenuItem value="paid">Pago</MenuItem>
                        <MenuItem value="cancelled">Cancelado</MenuItem>
                    </Select>
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
