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
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
} from "@mui/material";
import { JSX, useState } from "react";
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
import CustomBackdrop from "../custom-backdrop";
import { useGetAllCp } from "../../hooks/use-cp";
import { useGetAllCr } from "../../hooks/use-cr";
// ajuste o caminho conforme necessário

// Tipos inferidos dos schemas
type CreateTxFormData = z.infer<typeof createTxSchema>;
type UpdateTxFormData = z.infer<typeof updateTxSchema>;
type RadioInput = 'cp' | 'cr'

/* 
  Formulário de Criação de Tx
  Exibido quando o contexto indicar o modo "create"
*/
export function CreateTxForm(): JSX.Element | null | string {
    const mutation = usePostTx();
    const { forms } = useFormStore();
    const { isPending: isPendingCf, error: errorCf, data: cfData } = useGetAllCf();
    const { isPending: isPendingCat, error: errorCat, data: catData } = useGetAllCat();
    const { isPending: isPendingCp, error: errorCp, data: cpData } = useGetAllCp();
    const { isPending: isPendingCr, error: errorCr, data: crData } = useGetAllCr();
    const [account, setAccount] = useState<RadioInput>('cp')


    const { session } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CreateTxFormData>({
        resolver: zodResolver(createTxSchema),
        mode: "onSubmit",
        defaultValues: {
            value: "",
            cf: "",
            description: "",
            category: "",
            obs: "",
            tdate: "",
            cp: undefined,
            cr: undefined,
            user: session ? session.user.id : "",
        },
    });

    const onSubmit = async (data: CreateTxFormData) => {
        try {
            await mutation.mutateAsync(data);
            reset({

            })
        } catch (err) {
            console.error("Erro ao criar Transação:", err);
        }
    };

    if (forms.tx.type === "update") return null;

    if (errorCf || errorCat || errorCp || errorCr) {
        const errorMessage = errorCf?.message || errorCat?.message || errorCp?.message || errorCr?.message;
        return <ErrorAlert message={errorMessage ? errorMessage : 'Ocorreu um erro!'} />;
    }

    return (
        <FormContainer formName='tx'>
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

            {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

            {(isPendingCf || isPendingCat || isPendingCp || isPendingCr) && <CustomBackdrop isOpen={true} />}

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
                                    variant="outlined"
                                    size="small"
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
                            label="Data da Transação"
                            {...register("tdate")}
                            sx={{ width: '100%' }}
                            variant="outlined"
                            size="small"
                            error={!!errors.tdate}
                            helperText={errors.tdate?.message}
                            type="date"
                            slotProps={{
                                inputLabel: { shrink: true },
                            }}
                        />

                    </Box>

                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                sx={{ flex: 1, width: '100%' }}
                                options={catData ? catData : []}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                value={field.value ? (catData?.find((option) => option.id === field.value) || null) : null}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Categoria"
                                        size="small"
                                        variant="outlined"
                                        error={!!errors.category}
                                        helperText={errors.category?.message}
                                    />
                                )}
                            />
                        )}
                    />

                    <Controller
                        name="cf"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={cfData ? cfData : []}
                                getOptionLabel={(option) => option.number ? `${option.number} | ${option.ag} | ${option.bank}` : ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                value={field.value ? (cfData?.find((option) => option.id === field.value) || null) : null}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="N. | Ag | Banco - Conta Financeira"
                                        variant="outlined"
                                        size="small"
                                        error={!!errors.cf}
                                        helperText={errors.cf?.message}
                                    />
                                )}
                            />
                        )}
                    />

                    <FormControl>
                        <FormLabel id="radio-buttons-group-label">Conta a</FormLabel>
                        <RadioGroup
                            aria-labelledby="radio-buttons-group-label"
                            defaultValue={account}
                            name="radio-buttons-group"
                            onChange={(e) => setAccount(e.target.value as RadioInput)}
                            sx={{ display: "flex", flexDirection: 'row', marginBottom: -2 }}
                        >
                            <FormControlLabel value="cp" control={<Radio />} label="pagar" />
                            <FormControlLabel value="cr" control={<Radio />} label="receber" />
                        </RadioGroup>
                    </FormControl>

                    {account === 'cp' ? (
                        <Controller
                            name="cp"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    sx={{ flex: 1, width: '100%' }}
                                    options={cpData ? cpData : []}
                                    getOptionLabel={(option) => option.id ? `${option.supplier.name} | ${new Date(option.due + 'T00:00:00').toLocaleDateString()} | R$ ${strToPtBrMoney(String(option.value))}` : ""}
                                    onChange={(_, data) => field.onChange(data ? data.id : "")}
                                    value={field.value ? (cpData?.find((option) => option.id === field.value) || null) : null}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Fornecedor | Vcto. | Valor - Conta a pagar"
                                            size="small"
                                            variant="outlined"
                                            error={!!errors.cp}
                                            helperText={errors.cp?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    ) : (
                        <Controller
                            name="cr"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    options={crData ? crData : []}
                                    getOptionLabel={(option) => option.id ? `${option.customer.name} | ${new Date(option.due + 'T00:00:00').toLocaleDateString()} | R$ ${strToPtBrMoney(String(option.value))}` : ""}
                                    onChange={(_, data) => field.onChange(data ? data.id : "")}
                                    value={field.value ? (crData?.find((option) => option.id === field.value) || null) : null}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Cliente | Vcto. | Valor - Conta a receber"
                                            variant="outlined"
                                            size="small"
                                            error={!!errors.cr}
                                            helperText={errors.cr?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    )}

                    <TextField
                        label="Descrição"
                        {...register("description")}
                        variant="outlined"
                        size="small"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />

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

    const { forms } = useFormStore();
    const mutation = usePutTx(forms.tx.updateItem ? forms.tx.updateItem.id : '');
    const { isPending: isPendingCf, error: errorCf, data: cfData } = useGetAllCf();
    const { isPending: isPendingCat, error: errorCat, data: catData } = useGetAllCat();
    const { isPending: isPendingCp, error: errorCp, data: cpData } = useGetAllCp();
    const { isPending: isPendingCr, error: errorCr, data: crData } = useGetAllCr();
    const [account, setAccount] = useState<RadioInput>('cp')


    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm<UpdateTxFormData>({
        resolver: zodResolver(updateTxSchema),
        defaultValues: forms.tx.updateItem ? {
            value: strToPtBrMoney(forms.tx.updateItem?.value || ""),
            cf: forms.tx.updateItem.cf ? forms.tx.updateItem.cf : undefined,
            cp: forms.tx.updateItem.cp ? forms.tx.updateItem.cp : undefined,
            cr: forms.tx.updateItem.cr ? forms.tx.updateItem.cr : undefined,
            description: forms.tx.updateItem.description ? forms.tx.updateItem.description : '',
            category: forms.tx.updateItem.category ? forms.tx.updateItem.category : undefined,
            obs: forms.tx.updateItem.obs ? forms.tx.updateItem.obs : undefined,
            status: forms.tx.updateItem.status,
            tdate: forms.tx.updateItem.tdate ? String(forms.tx.updateItem.tdate) : '',
        } : {},
    });

    const statusValue = watch("status");

    const onSubmit = async (data: UpdateTxFormData) => {
        try {
            await mutation.mutateAsync(data);
            reset({
                value: strToPtBrMoney(data.value || ""),
                cf: data.cf ? data.cf : undefined,
                cp: data.cp ? data.cp : undefined,
                cr: data.cr ? data.cr : undefined,
                description: data.description ? data.description : '',
                category: data.category ? data.category : undefined,
                obs: data.obs ? data.obs : undefined,
                status: data.status,
                tdate: data.tdate ? String(data.tdate) : '', 
            })
        } catch (err) {
            console.error("Erro ao atualizar Transação:", err);
        }
    };

    if (forms.tx.type === "create" || !forms.tx.updateItem) return null;

    if (errorCf || errorCat || errorCp || errorCr) {
        const errorMessage = errorCf?.message || errorCat?.message || errorCp?.message || errorCr?.message;
        return <ErrorAlert message={errorMessage ? errorMessage : 'Ocorreu um erro!'} />;
    }

    return (
        <FormContainer formName='tx'>
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

            {mutation.isPending && <CustomBackdrop isOpen={mutation.isPending} />}

            {(isPendingCf || isPendingCat || isPendingCp || isPendingCr) && <CustomBackdrop isOpen={true} />}

            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", minWidth: 500 }}>
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

                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={catData ? catData : []}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                defaultValue={
                                    catData && catData.find(
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

                    <Controller
                        name="cf"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                options={cfData ? cfData : []}
                                getOptionLabel={(option) => option.number ? `${option.number} | ${option.ag} | ${option.bank}` : ""}
                                onChange={(_, data) => field.onChange(data ? data.id : "")}
                                defaultValue={
                                    cfData && cfData.find(
                                        (option) => option.id === forms.tx.updateItem?.cf
                                    ) || null
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="N. | Ag | Banco - Conta Financeira"
                                        variant="outlined"
                                        error={!!errors.cf}
                                        helperText={errors.cf?.message}
                                    />
                                )}
                            />
                        )}
                    />

                    <FormControl>
                        <FormLabel id="radio-buttons-group-label">Conta a</FormLabel>
                        <RadioGroup
                            aria-labelledby="radio-buttons-group-label"
                            defaultValue={account}
                            name="radio-buttons-group"
                            onChange={(e) => setAccount(e.target.value as RadioInput)}
                            sx={{ display: "flex", flexDirection: 'row', marginBottom: -2 }}
                        >
                            <FormControlLabel value="cp" control={<Radio />} label="pagar" />
                            <FormControlLabel value="cr" control={<Radio />} label="receber" />
                        </RadioGroup>
                    </FormControl>

                    {account ? (
                        <Controller
                            name="cp"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    options={cpData ? cpData : []}
                                    getOptionLabel={(option) => option.id ? `${option.supplier.name} | ${new Date(option.due + 'T00:00:00').toLocaleDateString()} | R$ ${strToPtBrMoney(String(option.value))}` : ""}
                                    onChange={(_, data) => field.onChange(data ? data.id : "")}
                                    defaultValue={
                                        cpData && cpData.find(
                                            (option) => option.id === forms.tx.updateItem?.cp
                                        ) || null
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Fornecedor | Vcto. | Valor - Conta a pagar"
                                            variant="outlined"
                                            error={!!errors.cp}
                                            helperText={errors.cp?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    ) : (

                        <Controller
                            name="cr"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    options={crData ? crData : []}
                                    getOptionLabel={(option) => option.id ? `${option.customer.name} | ${new Date(option.due + 'T00:00:00').toLocaleDateString()} | R$ ${strToPtBrMoney(String(option.value))}` : ""}
                                    onChange={(_, data) => field.onChange(data ? data.id : "")}
                                    defaultValue={
                                        crData && crData.find(
                                            (option) => option.id === forms.tx.updateItem?.cr
                                        ) || null
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Cliente | Vcto. | Valor - Conta a receber"
                                            variant="outlined"
                                            error={!!errors.cr}
                                            helperText={errors.cr?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    )
                    }

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
                        control={<Checkbox size="small" checked={statusValue} {...register("status")} />}
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
