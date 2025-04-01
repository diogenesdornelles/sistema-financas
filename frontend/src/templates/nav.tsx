import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/use-auth';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Nav() {
    const { session, logOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logOut();
        navigate('/login');
    };

    return (

        <AppBar position="static" sx={{flexGrow: 0, flexShrink: 0}}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Meu Sistema
                </Typography>

                {session ? (
                    <>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/cadastrar">Cadastrar</Button>
                        <Button color="inherit" component={Link} to="/consultas">Consultas</Button>
                        <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </>
                ) : (
                    <Typography variant="body1">Faça login</Typography>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Nav;