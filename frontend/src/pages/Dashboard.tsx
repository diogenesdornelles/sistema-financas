import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Divider, Grid, Paper, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ErrorAlert from '@/components/alerts/ErrorAlert';
import CustomBackdrop from '@/components/ui/CustomBackdrop';
import { colors, optionsCpsCrs, optionsPie } from '@/constants/dashboard';
import { useGetAllCf } from '@/hooks/service/cf/useGetAllCf';
import { useGetBalances } from '@/hooks/service/db/useGetBalances';
import { useGetCpsCrs } from '@/hooks/service/db/useGetCpsCrs';
import { strToPtBrMoney } from '@/utils/strToPtBrMoney';
import { DbBalanceProps } from '@packages/dtos/db.dto';
import { queryDbSchema } from '@packages/validators/zodSchemas/query/queryDbValidator';

ChartJS.register(ArcElement, Tooltip, Legend, Title, LinearScale, CategoryScale, BarElement);

type DashboardFormData = z.infer<typeof queryDbSchema>;

type DataChart = {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }>;
};

function Dashboard() {
  const [balances, setBalances] = useState<DbBalanceProps | null>(null);
  const [dataPie, setDataPie] = useState<DataChart | null>({
    labels: [],
    datasets: [
      {
        borderWidth: 1,
        label: 'Saldo Atual',
        data: [],
        backgroundColor: [],
        borderColor: [],
      },
    ],
  });

  const DAYS = 30;

  const [dataStack, setDataStack] = useState<DataChart | null>({
    labels: [],
    datasets: [
      {
        borderWidth: 1,
        label: 'Contas',
        data: [],
        backgroundColor: [],
        borderColor: [],
      },
    ],
  });
  const [dateToBalance, setDateToBalance] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dateToAccount] = useState<string>(() => {
    const today = new Date();
    today.setDate(today.getDate() + DAYS); // Adiciona dias
    return today.toISOString().split('T')[0];
  });
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DashboardFormData>({
    resolver: zodResolver(queryDbSchema),
    mode: 'onSubmit',
    defaultValues: {
      dateBalance: new Date().toISOString().split('T')[0],
    },
  });

  const { isPending: isPendingBalances, error: errorBalances, data: dataBalances } = useGetBalances(dateToBalance);
  const { isPending: isPendingCpsCrs, error: errorCpsCrs, data: dataCpsCrs } = useGetCpsCrs(dateToAccount);
  const { isPending: isPendingCfs, error: errorCfs, data: dataCfs } = useGetAllCf();

  const onSubmit = (data: DashboardFormData) => {
    try {
      const dateObject = new Date(data.dateBalance + 'T00:00:00.000Z');
      setDateToBalance(dateObject.toISOString());
    } catch (err) {
      console.error('Erro ao processar data ou iniciar busca:', err);
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
      const data: DataChart = {
        labels: [],
        datasets: [
          {
            borderWidth: 1,
            label: 'Saldo Atual',
            data: [],
            backgroundColor: [],
            borderColor: [],
          },
        ],
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
        datasets: [
          {
            borderWidth: 1,
            label: 'Saldo Atual',
            data: [],
            backgroundColor: [],
            borderColor: [],
          },
        ],
      });
    }
  }, [dataCfs]);

  useEffect(() => {
    if (dataCpsCrs && (dataCpsCrs.cps.length > 0 || dataCpsCrs.crs.length > 0)) {
      const data: DataChart = {
        labels: [],
        datasets: [
          {
            borderWidth: 1,
            label: 'A pagar',
            data: [],
            backgroundColor: [],
            borderColor: [],
          },
          {
            borderWidth: 1,
            label: 'A receber',
            data: [],
            backgroundColor: [],
            borderColor: [],
          },
        ],
      };

      let count = 0;

      // Gerar as labels para os próximos 30 dias
      while (count <= DAYS) {
        const today = new Date();
        today.setDate(today.getDate() + count); // Adiciona dias
        data.labels.push(today.toISOString().split('T')[0]);
        count++;
      }

      // Preencher os datasets com os valores de cps e crs
      data.labels.forEach((label) => {
        // Processar os valores de "cps" (Contas a Pagar)
        const totalCps = dataCpsCrs.cps
          .filter((cp) => cp.due === label) // Filtrar por data de vencimento
          .reduce((sum, cp) => sum + cp.value, 0); // Somar os valores
        data.datasets[0].data.push(totalCps);
        data.datasets[0].backgroundColor.push(colors[4]);
        data.datasets[0].borderColor.push(colors[4]);

        // Processar os valores de "crs" (Contas a Receber)
        const totalCrs = dataCpsCrs.crs
          .filter((cr) => cr.due === label) // Filtrar por data de vencimento
          .reduce((sum, cr) => sum + cr.value, 0); // Somar os valores
        data.datasets[1].data.push(totalCrs);
        data.datasets[1].backgroundColor.push(colors[9]);
        data.datasets[1].borderColor.push(colors[9]);
      });

      setDataStack(data);
    } else {
      setDataStack({
        labels: [],
        datasets: [
          {
            borderWidth: 1,
            label: 'Contas',
            data: [],
            backgroundColor: [],
            borderColor: [],
          },
        ],
      });
    }
  }, [dataCpsCrs]);

  if (errorBalances) return <ErrorAlert message={errorBalances.message} />;
  if (errorCpsCrs) return <ErrorAlert message={errorCpsCrs.message} />;
  if (errorCfs) return <ErrorAlert message={errorCfs.message} />;

  return (
    <Grid container sx={{ padding: 1, width: '100%', maxHeight: '85vh', overflow: 'scroll' }}>
      <Grid size={6}>
        <Box
          sx={{
            bgcolor: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.grey[900],
            borderRadius: 1,
            flex: 1,
            p: 1,
            overflow: 'scroll',
          }}
        >
          {isPendingBalances && <CustomBackdrop isOpen={isPendingBalances} />}
          {!isPendingBalances && balances && balances.result && balances.result.length > 0 ? (
            <>
              <Paper elevation={3} sx={{ p: 1 }}>
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
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  textAlign: 'center',
                  marginTop: 1,
                  color: 'white',
                  bgcolor: theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.grey[800],
                  alignSelf: 'center',
                  borderRadius: 1,
                }}
              >
                Contas Movimentadas até {new Date(dateToBalance).toLocaleDateString()}
              </Typography>
              <Grid container spacing={3}>
                {balances.result.map((account) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={account.cfId}>
                    <Box
                      sx={{
                        bgcolor: theme.palette.mode === 'light' ? 'white' : theme.palette.grey[800],
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h4"
                        sx={{ fontWeight: 900, display: 'flex', justifyContent: 'space-between' }}
                      >
                        <span>Conta: </span> <span>{account.cfNumber}</span>
                      </Typography>
                      <Divider sx={{ marginBottom: 1 }} />
                      <Typography
                        variant="body2"
                        component="p"
                        sx={{ display: 'flex', justifyContent: 'space-between' }}
                      >
                        <span>Inicial: </span> <span>R$ {strToPtBrMoney(String(account.firstBalance))}</span>
                      </Typography>
                      <Typography
                        variant="body2"
                        component="p"
                        sx={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}
                      >
                        <span>Entradas: </span>{' '}
                        <span style={{ color: 'green' }}>R$ {strToPtBrMoney(String(account.totalEntry))}</span>
                      </Typography>
                      <Typography
                        variant="body2"
                        component="p"
                        sx={{ display: 'flex', justifyContent: 'space-between' }}
                      >
                        <span>Saídas: </span>{' '}
                        <span style={{ color: 'red' }}>R$ {strToPtBrMoney(String(account.totalOutflow))}</span>
                      </Typography>
                      <Divider sx={{ marginTop: 1 }} />
                      <Typography
                        variant="body1"
                        component="p"
                        sx={{
                          fontWeight: 'bold',
                          color: account.currentBalance >= 0 ? theme.palette.info.dark : theme.palette.error.main,
                          marginTop: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>Saldo: </span> <span>R$ {strToPtBrMoney(String(account.currentBalance))}</span>
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            !isPendingBalances && (
              <Paper elevation={3} sx={{ p: 1, mt: 3, textAlign: 'center' }}>
                <Typography>Nenhum balanço encontrado para a data selecionada.</Typography>
              </Paper>
            )
          )}
        </Box>
      </Grid>
      <Grid size={6}>
        <Box
          sx={{
            borderWidth: 1,
            borderColor: 'primary.dark',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '40vh',
            p: 1,
          }}
        >
          {isPendingCfs && <CustomBackdrop isOpen={isPendingCfs} />}
          {!isPendingCfs && dataPie && dataPie.datasets[0].data.length > 0 && (
            <Pie data={dataPie} options={optionsPie} />
          )}
        </Box>
      </Grid>
      {isPendingCpsCrs && <CustomBackdrop isOpen={isPendingCpsCrs} />}
      <Grid size={6}>
        <Box sx={{ minHeight: '40vh' }}>
          {!isPendingCpsCrs && dataCpsCrs && dataStack && (dataCpsCrs.cps.length > 0 || dataCpsCrs.crs.length > 0) && (
            <Bar options={optionsCpsCrs} data={dataStack} />
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
