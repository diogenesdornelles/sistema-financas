import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CreateTcfForm, UpdateTcfForm } from "../components/forms/tcf-forms";
import TcfTable from "../components/tables/tcf-table";
import ManageArea from "../components/manage-area";
import { TValue } from "../types/form-state";
import { useFormStore } from "../hooks/use-form-store";
import { CreateTcrForm, UpdateTcrForm } from "../components/forms/tcr-forms";
import TcrTable from "../components/tables/tcr-table";
import { CreateTcpForm, UpdateTcpForm } from "../components/forms/tcp-forms";
import TcpTable from "../components/tables/tcp-table";
import UserTable from "../components/tables/user-table";
import { CreateUserForm, UpdateUserForm } from "../components/forms/user-forms";
import { CreatePartnerForm, UpdatePartnerForm } from "../components/forms/partner-forms";
import PartnerTable from "../components/tables/partner-table";
import { CreateCatForm, UpdateCatForm } from "../components/forms/cat-forms";
import { CreateCfForm, UpdateCfForm } from "../components/forms/cf-forms";
import CfTable from "../components/tables/cf-table";
import { CreateCpForm, UpdateCpForm } from "../components/forms/cp-forms";
import CpTable from "../components/tables/cp-table";
import { CreateCrForm, UpdateCrForm } from "../components/forms/cr-forms";
import CrTable from "../components/tables/cr-table";
import { CreateTxForm, UpdateTxForm } from "../components/forms/tx-forms";
import TxTable from "../components/tables/tx-table";
import CatTable from "../components/tables/cat-table";


function Manage() {
  const [value, setValue] = useState<TValue>("cf");
  const { forms } = useFormStore();
  const [forceRender, setForceRender] = useState(0);

  useEffect(() => {
    setForceRender((prev) => prev + 1);
  }, [forms]);

  const renderContent = () => {
    switch (value) {
      case "cf":
        return (
          <ManageArea
            Form={forms.cf.type === "create" ? <CreateCfForm /> : <UpdateCfForm />}
            Table={<CfTable />}
          />
        );
      case "tcf":
        return (
          <ManageArea
            Form={forms.tcf.type === "create" ? <CreateTcfForm /> : <UpdateTcfForm />}
            Table={<TcfTable />}
          />
        );
      case "cr":
        return (
          <ManageArea
            Form={forms.cr.type === "create" ? <CreateCrForm /> : <UpdateCrForm />}
            Table={<CrTable />}
          />
        );
      case "tcr":
        return (
          <ManageArea
            Form={forms.tcr.type === "create" ? <CreateTcrForm /> : <UpdateTcrForm />}
            Table={<TcrTable />}
          />
        );
      case "cp":
        return (
          <ManageArea
            Form={forms.cp.type === "create" ? <CreateCpForm /> : <UpdateCpForm />}
            Table={<CpTable />}
          />
        );
      case "tcp":
        return (
          <ManageArea
            Form={forms.tcp.type === "create" ? <CreateTcpForm /> : <UpdateTcpForm />}
            Table={<TcpTable />}
          />
        );
      case "partner":
        return (
          <ManageArea
            Form={forms.partner.type === "create" ? <CreatePartnerForm /> : <UpdatePartnerForm />}
            Table={<PartnerTable />}
          />
        );
      case "tx":
        return (
          <ManageArea
            Form={forms.tx.type === "create" ? <CreateTxForm /> : <UpdateTxForm />}
            Table={<TxTable />}
          />
        );
      case "cat":
        return (
          <ManageArea
            Form={forms.cat.type === "create" ? <CreateCatForm /> : <UpdateCatForm />}
            Table={<CatTable />}
          />
        );
      case "user":
        return (
          <ManageArea
            Form={forms.user.type === "create" ? <CreateUserForm /> : <UpdateUserForm />}
            Table={<UserTable />}
          />
        );
      default:
        return <Typography>Selecione uma aba</Typography>;
    }
  };

  return (
    <Box
      key={forceRender}
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 1,
        height: "100%",
        padding: null
      }}
    >
      <Tabs
        value={value}
        onChange={(e, newValue) => setValue(newValue as TValue)}
        textColor="primary"
        variant="scrollable"
        scrollButtons={true}
        indicatorColor="primary"
        aria-label="Tabs de gerenciamento"
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.common.black,
        }}
      >
        <Tab value="cf" label="Contas financeiras" sx={{ fontWeight: 800 }} />
        <Tab value="tcf" label="Tipos de conta financeira" sx={{ fontWeight: 800 }} />
        <Tab value="cr" label="Contas a receber" sx={{ fontWeight: 800 }} />
        <Tab value="tcr" label="Tipos de conta a receber" sx={{ fontWeight: 800 }} />
        <Tab value="cp" label="Contas a pagar" sx={{ fontWeight: 800 }} />
        <Tab value="tcp" label="Tipos de conta a pagar" sx={{ fontWeight: 800 }} />
        <Tab value="partner" label="Parceiros" sx={{ fontWeight: 800 }} />
        <Tab value="tx" label="Transações" sx={{ fontWeight: 800 }} />
        <Tab value="cat" label="Categorias" sx={{ fontWeight: 800 }} />
        <Tab value="user" label="Usuários" sx={{ fontWeight: 800 }} />
      </Tabs>
      <Box sx={{ display: "flex", flex: 1, marginTop: 4, width: "100%", height: "100%" }}>
        {renderContent()}
      </Box>
    </Box>
  );
}

export default Manage;