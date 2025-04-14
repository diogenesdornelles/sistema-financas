import { Container, TextField, Typography } from "@mui/material";
import { useGetBalances } from "../hooks/use-db";
import ErrorAlert from "../components/alerts/error-alert";
import CustomBackdrop from "../components/custom-backdrop";
import { z } from "zod";
import { queryDbSchema } from '../../../packages/validators/zod-schemas/query/query-db.validator'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type DashboardFormData = z.infer<typeof queryDbSchema>;

function Dashboard() {

    const {
        register,
        handleSubmit,
        // control,
        watch,
        formState: { errors },
    } = useForm<DashboardFormData>({
        resolver: zodResolver(queryDbSchema),
        mode: 'onSubmit',
        defaultValues: {
            dateBalance: new Date().toISOString()
        }
    });

    const dateBalance = watch('dateBalance');

    const { isPending: isPendingBalances, error: errorBalances, data: dataBalances } = useGetBalances(dateBalance)

    const onSubmit = async (data: DashboardFormData) => {
        try {
            console.log(data)
        } catch (err) {
            console.error("Erro ao atualizar Conta:", err);
        }
    };

    if (errorBalances) return <ErrorAlert message={errorBalances.message} />;

    console.log(dataBalances) // chegou!
    return (<Container
        sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            columnGap: 10,
            rowGap: 10,
            flexWrap: 'wrap',
            justifyContent: "center",
            alignItems: 'center'
        }}
    >
        {(isPendingBalances) && <CustomBackdrop isOpen={isPendingBalances} />}
        <Typography variant="h2" component="h2" >Saldo atual: balances</Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%", minWidth: 500 }}>
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
            />
        </form>
    </Container>
    );
}
export default Dashboard;
