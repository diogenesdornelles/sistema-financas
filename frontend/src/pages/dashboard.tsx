import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Grid,
    Paper,
    Divider
} from "@mui/material";
import { useGetBalances } from "../hooks/use-db";
import ErrorAlert from "../components/alerts/error-alert";
import CustomBackdrop from "../components/custom-backdrop";
import { z } from "zod";
import { queryDbSchema } from '../../../packages/validators/zod-schemas/query/query-db.validator'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DbBalanceProps } from "../../../packages/dtos/db.dto";
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { strToPtBrMoney } from "../utils/strToPtBrMoney";

type DashboardFormData = z.infer<typeof queryDbSchema>;

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function Dashboard() {
    const [balances, setBalances] = useState<DbBalanceProps | null>(null);
    const [dateToFetch, setDateToFetch] = useState<string>(new Date().toISOString().split('T')[0]);
    const theme = useTheme()

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
        <Container sx={{ flexGrow: 1, paddingY: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Painel de Balanços
            </Typography>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                            <TextField
                                label="Data para balanço"
                                {...register('dateBalance')}
                                variant="outlined"
                                type="date"
                                slotProps={{
                                    inputLabel: { shrink: true },
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
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12 }} sx={{bgcolor: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.grey[900], borderRadius: 2, padding: 3 } }>
                    {isPendingBalances && <CustomBackdrop isOpen={isPendingBalances} />}
                    {!isPendingBalances && balances && balances.result && balances.result.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h5" gutterBottom sx={{marginBottom: 3, color: 'white', alignSelf: 'center'}}>
                                Contas Movimentadas até {new Date(dateToFetch).toLocaleDateString()}
                            </Typography>
                            <Grid container spacing={3}>
                                {balances.result.map((account) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={account.cfId}>
                                        <Item elevation={3} >
                                            <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: 900, display: "flex", justifyContent: 'space-between' }}>
                                                <span>Conta: </span> <span>{account.cfNumber}</span>
                                            </Typography>
                                            <Divider sx={{ marginBottom: 2 }} />
                                            <Typography variant="body2" component="p" gutterBottom sx={{ display: "flex", justifyContent: 'space-between' }}>
                                                <span>Inicial: </span> <span>R$ {strToPtBrMoney(String(account.cfInitial))}</span>
                                            </Typography>
                                            <Typography variant="body2" component="p" gutterBottom sx={{ display: "flex", justifyContent: 'space-between', flex: 1 }}>
                                                <span>Entradas: </span> <span style={{ color: 'green' }}>R$ {strToPtBrMoney(String(account.totalIn))}</span>
                                            </Typography>
                                            <Typography variant="body2" component="p" gutterBottom sx={{ display: "flex", justifyContent: 'space-between' }}>
                                                <span>Saídas: </span> <span style={{ color: 'red' }}>R$ {strToPtBrMoney(String(account.totalOut))}</span>
                                            </Typography>
                                            <Divider sx={{ marginTop: 2 }} />
                                            <Typography variant="body1" component="p" sx={{ fontWeight: 'bold', color: account.balance >= 0 ? theme.palette.info.dark : theme.palette.error.main, marginTop: 2, display: "flex", justifyContent: 'space-between' }}>
                                                <span>Saldo: </span> <span>R$ {strToPtBrMoney(String(account.balance))}</span>
                                            </Typography>
                                        </Item>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ) : (
                        !isPendingBalances && (
                            <Paper elevation={3} sx={{ p: 2, mt: 3, textAlign: 'center' }}>
                                <Typography>Nenhum balanço encontrado para a data selecionada.</Typography>
                            </Paper>
                        )
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}

export default Dashboard;