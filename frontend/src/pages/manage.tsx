import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CreateTcfForm, UpdateTcfForm } from "../components/forms/tcf-forms";
import TcfList from "../components/lists/tcf-list";
import ManageArea from "../components/manage-area";
import { TValue } from "../types/form-state";
import { useFormStore } from "../hooks/use-form-store";


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
        return <Typography>Conteúdo de Contas financeiras</Typography>;
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
        return <Typography>Conteúdo de Tipos de Conta a Receber</Typography>;
      case "cp":
        return <Typography>Conteúdo de Contas a Pagar</Typography>;
      case "tcp":
        return <Typography>Conteúdo de Tipos de Conta a Pagar</Typography>;
      case "partner":
        return <Typography>Conteúdo de Parceiros</Typography>;
      case "tx":
        return <Typography>Conteúdo de Transações</Typography>;
      case "cat":
        return <Typography>Conteúdo de Categorias</Typography>;
      case "user":
        return <Typography>Conteúdo de Usuários</Typography>;
      default:
        return <Typography>Selecione uma aba</Typography>;
    }
  };

  return (
    <Box
      key={forceRender} // Força o re-render ao alterar o estado
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