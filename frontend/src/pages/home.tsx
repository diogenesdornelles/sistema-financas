import { Container, Card, CardMedia, CardContent, Typography } from "@mui/material";
import dash from '../assets/images/dashboard.svg';
import logout from '../assets/images/logout.svg';
import { useNavigate } from "react-router-dom";
import manage from '../assets/images/manage.svg';
import { useEndSession } from "../hooks/use-end-session";
import { motion } from 'framer-motion';
import help from '../assets/images/help.svg'


const MotionCard = motion.create(Card);

type PagePath = '/gerenciar' | '/dashboard' | '/login' | '/manual';

type Page = {
    image: string,
    title: string,
    description: string,
    path: PagePath
}

const cards: Page[] = [
    {
        image: manage,
        title: 'Gerenciar',
        description: 'Visualize, cadastre e altere aqui registros sobre parceiros, contas financeias, contas a pagar e a receber, tipos de contas e transações',
        path: '/gerenciar'
    },
    {
        image: dash,
        title: 'Dashboard',
        description: 'Visualize de modo rápido os principais indicadores de controle financeiro',
        path: '/dashboard'
    },
    {
        image: logout,
        title: 'Logout',
        description: 'Encerre a sessão rapidamente',
        path: '/login'
    },
    {
        image: help,
        title: 'Manual',
        description: 'Conheça mais sobre o sistema',
        path: '/manual'
    }
];


function Home() {
    const navigate = useNavigate();
    const endSession = useEndSession();

    const handleClick = (path: PagePath) => {
        if (path === '/login') {
            endSession()
            return
        }
        navigate(path)
    }

    return (
        <Container
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
            {cards.map((card) => (
                <MotionCard
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => handleClick(card.path)}
                    key={card.title}
                    sx={{ display: 'flex', flexDirection: 'column', maxWidth: 345, flexGrow: 1, flexShrink: 0, flexBasis: 0, minWidth: 200, minHeight: 300, transition: "none", cursor: 'pointer' }}
                >
                        <CardMedia
                            sx={{ width: 150, height: 'auto', alignSelf: 'center', p: 1 }}
                            component="img"
                            height="auto"
                            width="140"
                            image={card.image}
                            alt={card.title}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div" sx={{textAlign: 'center'}}>
                                {card.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {card.description}
                            </Typography>
                        </CardContent>
                </MotionCard>
            ))}
        </Container>
    );
}

export default Home;
