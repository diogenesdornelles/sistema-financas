import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CreateTcfForm, UpdateTcfForm } from "../components/forms/tcf-forms";
import TcfList from "../components/lists/tcf-list";
import ManageArea from "../components/manage-area";
import { TValue } from "../types/form-state";
import { useFormStore } from "../hooks/use-form-store";
import { CreateTcrForm, UpdateTcrForm } from "../components/forms/tcr-forms";
import TcrList from "../components/lists/tcr-list";
import { CreateTcpForm, UpdateTcpForm } from "../components/forms/tcp-forms";
import TcpList from "../components/lists/tcp-list";
import UserList from "../components/lists/user-list";
import { CreateUserForm, UpdateUserForm } from "../components/forms/user-forms";
import { CreatePartnerForm, UpdatePartnerForm } from "../components/forms/partner-forms";
import PartnerList from "../components/lists/partner-list";
import { CreateCatForm, UpdateCatForm } from "../components/forms/cat-forms";
import CatList from "../components/lists/cat-list";
import { CreateCfForm, UpdateCfForm } from "../components/forms/cf-forms";
import CfList from "../components/lists/cf-list";


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
            List={<CfList />}
          />
        );
      case "tcf":
        return (
          <ManageArea
            Form={forms.tcf.type === "create" ? <CreateTcfForm /> : <UpdateTcfForm />}
            List={<TcfList />}
          />
        );
      case "cr":
        return <Typography>Conteúdo de Contas a Receber</Typography>;
      case "tcr":
        return (
          <ManageArea
            Form={forms.tcr.type === "create" ? <CreateTcrForm /> : <UpdateTcrForm />}
            List={<TcrList />}
          />
        );
      case "cp":
        return <Typography>Conteúdo de Contas a Pagar</Typography>;
      case "tcp":
        return (
          <ManageArea
            Form={forms.tcp.type === "create" ? <CreateTcpForm /> : <UpdateTcpForm />}
            List={<TcpList />}
          />
        );
      case "partner":
        return (
          <ManageArea
            Form={forms.partner.type === "create" ? <CreatePartnerForm /> : <UpdatePartnerForm />}
            List={<PartnerList />}
          />
        );
      case "tx":
        return <Typography>Conteúdo de Transações</Typography>;
      case "cat":
        return (
          <ManageArea
            Form={forms.cat.type === "create" ? <CreateCatForm /> : <UpdateCatForm />}
            List={<CatList />}
          />
        );
      case "user":
        return (
          <ManageArea
            Form={forms.user.type === "create" ? <CreateUserForm /> : <UpdateUserForm />}
            List={<UserList />}
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
        marginTop: 2,
        height: "100%",
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