import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useGetBalances } from "../hooks/use-db";
import ErrorAlert from "../components/alerts/error-alert";
import CustomBackdrop from "../components/custom-backdrop";
import { z } from "zod";
import { queryDbSchema } from '../../../packages/validators/zod-schemas/query/query-db.validator'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DbBalanceProps } from "../../../packages/dtos/db.dto";

type DashboardFormData = z.infer<typeof queryDbSchema>;


function Dashboard() {
    const [balances, setBalances] = useState<DbBalanceProps | null>(null);
    const [dateToFetch, setDateToFetch] = useState<string>(new Date().toISOString().split('T')[0]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DashboardFormData>({
        resolver: zodResolver(queryDbSchema),
        mode: 'onSubmit',
        defaultValues: {
            dateBalance: new Date().toISOString().split('T')[0]
        }
    });

    const { isPending: isPendingBalances, error: errorBalances, data: dataBalances } = useGetBalances(dateToFetch);

    const onSubmit = (data: DashboardFormData) => {
        try {
            const dateObject = new Date(data.dateBalance + 'T00:00:00.000Z'); 
            setDateToFetch(dateObject.toISOString());
        } catch (err) {
            console.error("Erro ao processar data ou iniciar busca:", err);
        }
    };

    useEffect(() => {
        if (dataBalances && dataBalances.result && dataBalances.result.length > 0) {
            setBalances(dataBalances);
        } else {
            setBalances(null);
        }
    }, [dataBalances]);

    if (errorBalances) return <ErrorAlert message={errorBalances.message} />;

    return (
        <Container
            sx={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                gap: 4, 
                alignItems: 'center',
                paddingY: 4,
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", maxWidth: 500, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                    label="Data para balanço"
                    {...register('dateBalance')}
                    variant="outlined"
                    type="date"
                    InputLabelProps={{ 
                        shrink: true,
                    }}
                    error={!!errors.dateBalance}
                    helperText={errors.dateBalance?.message}
                    size="small"
                    sx={{ flexGrow: 1 }} 
                />
                <Button type="submit" variant="contained" color="primary" disabled={isPendingBalances}> 
                    Buscar
                </Button>
            </form>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
                {isPendingBalances && <CustomBackdrop isOpen={isPendingBalances} />}

                {!isPendingBalances && balances && balances.result && balances.result.length > 0 ? (
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                        {balances.result.map((account) => (
                            <Box key={account.cfId} sx={{ border: '1px solid lightgray', padding: 2, borderRadius: 1, minWidth: 250, textAlign: 'center' }}>
                                <Typography variant="h6" component="h3" gutterBottom> 
                                    Conta: {account.cfNumber}
                                </Typography>
                                <Typography variant="body1" component="p"> 
                                    Saldo: {account.balance} 
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    !isPendingBalances && <Typography>Nenhum balanço encontrado para a data selecionada.</Typography>
                )}
            </Box>
        </Container>
    );
}
export default Dashboard;