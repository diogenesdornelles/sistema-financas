import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


export default function CustomBackdrop({ isOpen }: { isOpen: boolean }) {

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={isOpen}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}