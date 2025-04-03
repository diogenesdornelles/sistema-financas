import { Container, Card, CardActionArea, CardMedia, CardContent, Typography } from "@mui/material";
import dash from '../assets/images/dash.webp'
import query from '../assets/images/query.webp'
import manage from '../assets/images/register.webp'
import { useNavigate } from "react-router-dom";

const cards: Array<{ image: string, title: string, description: string, path: string }> = [
    {
        image: manage,
        title: 'Gerenciar',
        description: 'Visualize, cadastre e altere aqui registros sobre parceiros, contas financeias, contas a pagar e a receber, tipos de contas e transações',
        path: '/gerenciar'
    },
    {
        image: query,
        title: 'Consultas',
        description: 'Acesse as consultas de propósito geral através desde card',
        path: '/consultas'
    }, {
        image: dash,
        title: 'Dashboard',
        description: 'Visualize de modo rápido os principais indicadores de controle financeiro',
        path: '/dashboard'
    }

]


function Home() {
    const navigate = useNavigate()

    return (<Container sx={{ display: 'flex', flex: 1, flexDirection: 'row', columnGap: 10, rowGap: 10, flexWrap: 'wrap', justifyContent: "center", alignItems: 'center' }}>
        {cards.map((card) => (
            <Card onClick={() => navigate(card.path)} key={card.title} sx={{ maxWidth: 345, flexGrow: 1, flexShrink: 0, flexBasis: 0, minWidth: 300, minHeight: 300 }}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image={card.image}
                        alt={card.title}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {card.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {card.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        ))}

    </Container>);
}
export default Home;
