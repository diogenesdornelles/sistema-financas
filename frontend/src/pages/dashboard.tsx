import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Paper,
    Divider,

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
import { useTheme } from '@mui/material/styles';
import { strToPtBrMoney } from "../utils/strToPtBrMoney";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useGetAllCf } from "../hooks/use-cf";

ChartJS.register(ArcElement, Tooltip, Legend);

type DashboardFormData = z.infer<typeof queryDbSchema>;

type DataPie = {
    labels: string[],
    datasets: Array<{
        label: string,
        data: number[],
        backgroundColor: string[],
        borderColor: string[],
        borderWidth: number
    }>
}

const colors = [
    '#E3F2FD',
    '#BBDEFB',
    '#90CAF9',
    '#64B5F6',
    '#42A5F5',
    '#2196F3',
    '#1E88E5',
    '#1976D2',
    '#1565C0',
    '#0D47A1'
]

// CP e CR em 30 dias, por série?

function Dashboard() {
    const [balances, setBalances] = useState<DbBalanceProps | null>(null);
    const [dataPie, setDataPie] = useState<DataPie | null>({
        labels: [],
        datasets: [{
            borderWidth: 1,
            label: 'Saldo Atual',
            data: [],
            backgroundColor: [],
            borderColor: []
        }]
    })
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
    const { isPending: isPendingCfs, error: errorCfs, data: dataCfs } = useGetAllCf();

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

    useEffect(() => {
        if (dataCfs && dataCfs.length > 0) {
            const data: DataPie = {
                labels: [],
                datasets: [{
                    borderWidth: 1,
                    label: 'Saldo Atual',
                    data: [],
                    backgroundColor: [],
                    borderColor: []
                }]
            };
            dataCfs.forEach((cf, i) => {
                data.labels.push(`${cf.number} | ${cf.ag} | ${cf.bank}`);
                data.datasets[0].data.push(cf.currentBalance);
                data.datasets[0].backgroundColor.push(colors[i % colors.length]);
                data.datasets[0].borderColor.push(colors[i % colors.length]);
            });

            setDataPie(data);
        } else {
            setDataPie({
                labels: [],
                datasets: [{
                    borderWidth: 1,
                    label: 'Saldo Atual',
                    data: [],
                    backgroundColor: [],
                    borderColor: []
                }]
            });
        }
    }, [dataCfs]);

    if (errorBalances) return <ErrorAlert message={errorBalances.message} />;
    if (errorCfs) return <ErrorAlert message={errorCfs.message} />;

    return (
        <Box sx={{ flexGrow: 1, padding: 4, display: 'flex', flexDirection: 'row', width: '100%', maxHeight: '80vh', overflow: 'scroll' }}>
            <Box sx={{ bgcolor: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.grey[900], borderRadius: 2, flex: 1, p: 2, maxHeight: '50vh', overflow: 'scroll' }}>
                {isPendingBalances && <CustomBackdrop isOpen={isPendingBalances} />}
                {!isPendingBalances && balances && balances.result && balances.result.length > 0 ? (
                    <>
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
                        <Typography variant="h5" gutterBottom sx={{ marginTop: 3, color: 'white', alignSelf: 'center' }}>
                            Contas Movimentadas até {new Date(dateToFetch).toLocaleDateString()}
                        </Typography>
                        <Grid container spacing={3}>
                            {balances.result.map((account) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={account.cfId}>
                                    <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2 }} >
                                        <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: 900, display: "flex", justifyContent: 'space-between' }}>
                                            <span>Conta: </span> <span>{account.cfNumber}</span>
                                        </Typography>
                                        <Divider sx={{ marginBottom: 2 }} />
                                        <Typography variant="body2" component="p" gutterBottom sx={{ display: "flex", justifyContent: 'space-between' }}>
                                            <span>Inicial: </span> <span>R$ {strToPtBrMoney(String(account.firstBalance))}</span>
                                        </Typography>
                                        <Typography variant="body2" component="p" gutterBottom sx={{ display: "flex", justifyContent: 'space-between', flex: 1 }}>
                                            <span>Entradas: </span> <span style={{ color: 'green' }}>R$ {strToPtBrMoney(String(account.totalEntry))}</span>
                                        </Typography>
                                        <Typography variant="body2" component="p" gutterBottom sx={{ display: "flex", justifyContent: 'space-between' }}>
                                            <span>Saídas: </span> <span style={{ color: 'red' }}>R$ {strToPtBrMoney(String(account.totalOutflow))}</span>
                                        </Typography>
                                        <Divider sx={{ marginTop: 2 }} />
                                        <Typography variant="body1" component="p" sx={{ fontWeight: 'bold', color: account.currentBalance >= 0 ? theme.palette.info.dark : theme.palette.error.main, marginTop: 2, display: "flex", justifyContent: 'space-between' }}>
                                            <span>Saldo: </span> <span>R$ {strToPtBrMoney(String(account.currentBalance))}</span>
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                ) : (
                    !isPendingBalances && (
                        <Paper elevation={3} sx={{ p: 2, mt: 3, textAlign: 'center' }}>
                            <Typography>Nenhum balanço encontrado para a data selecionada.</Typography>
                        </Paper>
                    )
                )}
            </Box>
            <Box sx={{ flex: 1, display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxHeight: '45vh' }}>
                <Typography variant="h5" gutterBottom sx={{ marginTop: 7, borderRadius: 2, alignSelf: 'center', color: 'white', p: 1, bgcolor: 'primary.dark', width: '90%', textAlign: 'center' }}>
                   Saldo por contas
                </Typography>
                {isPendingCfs && <CustomBackdrop isOpen={isPendingCfs} />}
                {!isPendingCfs && dataPie && dataPie.datasets[0].data.length > 0 && (
                    <Pie data={dataPie} />
                )}
            </Box>

        </Box>
    );
}

export default Dashboard;