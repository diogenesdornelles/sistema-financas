import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { CreateCatForm } from '@/components/forms/create/CreateCatForm';
import { CreateCfForm } from '@/components/forms/create/CreateCfForm';
import { CreateCpForm } from '@/components/forms/create/CreateCpForm';
import { CreateCrForm } from '@/components/forms/create/CreateCrForms';
import { CreatePartnerForm } from '@/components/forms/create/CreatePartnerForm';
import { CreateTcfForm } from '@/components/forms/create/CreateTcfForm';
import { CreateTcpForm } from '@/components/forms/create/CreateTcpForm';
import { CreateTcrForm } from '@/components/forms/create/CreateTcrForm';
import { CreateTxForm } from '@/components/forms/create/CreateTxForm';
import { CreateUserForm } from '@/components/forms/create/CreateUserForm';
import { UpdateCatForm } from '@/components/forms/update/UpdateCatForm';
import { UpdateCpForm } from '@/components/forms/update/UpdateCpForm';
import { UpdateCrForm } from '@/components/forms/update/UpdateCrForms';
import { UpdatePartnerForm } from '@/components/forms/update/UpdatePartnerForm';
import { UpdateTcfForm } from '@/components/forms/update/UpdateTcfForm';
import { UpdateTcpForm } from '@/components/forms/update/UpdateTcpForm';
import { UpdateTcrForm } from '@/components/forms/update/UpdateTcrForm';
import { UpdateTxForm } from '@/components/forms/update/UpdateTxForm';
import { UpdateUserForm } from '@/components/forms/update/UpdateUserForm';
import CatTable from '@/components/tables/CatTable';
import CfTable from '@/components/tables/CfTable';
import CpTable from '@/components/tables/CpTable';
import CrTable from '@/components/tables/CrTable';
import PartnerTable from '@/components/tables/PartnerTable';
import TcfTable from '@/components/tables/TcfTable';
import TcpTable from '@/components/tables/TcpTable';
import TcrTable from '@/components/tables/TcrTable';
import TxTable from '@/components/tables/TxTable';
import UserTable from '@/components/tables/UserTable';
import ManageArea from '@/components/ui/ManageArea';
import { TValue } from '@/domain/types/formState';
import { useFormStore } from '@/hooks/useFormStore';
import { UpdateCfForm } from '../components/forms/update/UpdateCfForm';

function Manage() {
  const [value, setValue] = useState<TValue>('cf');
  const { forms } = useFormStore();
  const [forceRender, setForceRender] = useState(0);

  useEffect(() => {
    setForceRender((prev) => prev + 1);
  }, [forms]);

  const renderContent = () => {
    switch (value) {
      case 'cf':
        return (
          <ManageArea Form={forms.cf.type === 'create' ? <CreateCfForm /> : <UpdateCfForm />} Table={<CfTable />} />
        );
      case 'tcf':
        return (
          <ManageArea Form={forms.tcf.type === 'create' ? <CreateTcfForm /> : <UpdateTcfForm />} Table={<TcfTable />} />
        );
      case 'cr':
        return (
          <ManageArea Form={forms.cr.type === 'create' ? <CreateCrForm /> : <UpdateCrForm />} Table={<CrTable />} />
        );
      case 'tcr':
        return (
          <ManageArea Form={forms.tcr.type === 'create' ? <CreateTcrForm /> : <UpdateTcrForm />} Table={<TcrTable />} />
        );
      case 'cp':
        return (
          <ManageArea Form={forms.cp.type === 'create' ? <CreateCpForm /> : <UpdateCpForm />} Table={<CpTable />} />
        );
      case 'tcp':
        return (
          <ManageArea Form={forms.tcp.type === 'create' ? <CreateTcpForm /> : <UpdateTcpForm />} Table={<TcpTable />} />
        );
      case 'partner':
        return (
          <ManageArea
            Form={forms.partner.type === 'create' ? <CreatePartnerForm /> : <UpdatePartnerForm />}
            Table={<PartnerTable />}
          />
        );
      case 'tx':
        return (
          <ManageArea Form={forms.tx.type === 'create' ? <CreateTxForm /> : <UpdateTxForm />} Table={<TxTable />} />
        );
      case 'cat':
        return (
          <ManageArea Form={forms.cat.type === 'create' ? <CreateCatForm /> : <UpdateCatForm />} Table={<CatTable />} />
        );
      case 'user':
        return (
          <ManageArea
            Form={forms.user.type === 'create' ? <CreateUserForm /> : <UpdateUserForm />}
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
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 1,
        height: '100%',
        padding: null,
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
          bgcolor: (theme) => (theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.common.black),
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
      <Box sx={{ display: 'flex', flex: 1, marginTop: 4, width: '100%', height: '100%' }}>{renderContent()}</Box>
    </Box>
  );
}

export default Manage;
