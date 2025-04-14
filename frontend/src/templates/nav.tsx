import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import ToggleThemeButton from '../components/toggle-theme-button';
import HelpIcon from '@mui/icons-material/Help';


function Nav() {
    const { session, logOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logOut();
        navigate('/login');
    };

    const navItems = [
        { label: 'Home', icon: <HomeIcon />, path: '/' },
        { label: 'Gerenciar', icon: <AppRegistrationIcon />, path: '/gerenciar' },
        { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { label: 'Manual', icon: <HelpIcon />, path: '/manual' },
    ];

    return (
        <AppBar position="static" sx={{ flexGrow: 0, flexShrink: 0 }}>
            <Toolbar>
                <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    SysFINAN
                </Typography>
                <ToggleThemeButton/>

                {session ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.label}
                                color="inherit"
                                component={Link}
                                to={item.path}
                                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            >
                                {item.icon}
                                <Typography variant="caption">{item.label}</Typography>
                            </Button>
                        ))}

                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                            <LogoutIcon />
                            <Typography variant="caption">Logout</Typography>
                        </Button>

                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 3 }}>
                            <Typography variant="body2">
                                Bem-vindo: {session.user.name.toUpperCase()}
                            </Typography>
                            <AccountCircleIcon sx={{ ml: 1 }} fontSize="large" />
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="body1">Faça login</Typography>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Nav;
