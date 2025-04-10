import { Box, Button, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useFormStore } from "../../../hooks/use-form-store";
import { TValue } from "../../../types/form-state";


export default function ButtonUpdateForm({name, title}: {name: TValue, title:  string}) {
    const { setFormType, setUpdateItem, setIsOpen } = useFormStore();

    const onClose = () => {
        setFormType(name, "create");
        setUpdateItem(name, null);
        setIsOpen(false, name)
    };
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
        <Typography variant="h4">{title}</Typography>
        <Button
            color="error"
            onClick={onClose}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
            <CloseIcon />
        </Button>
    </Box>
    )
}