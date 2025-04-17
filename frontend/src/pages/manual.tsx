import { Box, Typography, Grid, Divider } from "@mui/material";

const man = `
# As contas financeiras (CF) são a alma do sistema. Possuem um atributo 'número' como campo principal a ser fornecido no cadastramento, além de um tipo (TCF) para melhor categorizá-las;
# Pressupõe-se, de antemão, seja a CF uma conta em instituição bancária usual, de modo que também é possível o preenchimento de outros campos, como agência e banco;
# Se, porventura, se tratar de um cartão (crédito ou débito) é possível aproveitar os campos com informações que o identifique univocamente;
# Todas as CFs possuem, ainda, um saldo, o qual deve ser apresentado sempre de forma atualizada. Saldo pode ser passando quando do cadastramento. O padrão, é R$ 0,00;
# O saldo somente pode ser incrementado ou decrementado, respectivamente, por um efetivo recebimento ou pagamento de uma conta, a título de fornecimento ou recebimento de um bem ou serviço;
# O retorno de um saldo depende da informação de uma data específica, na qual haverá um encontro de contas entre Saídas e Entradas até então;
# Para um recebimento, o sistema permite o gerenciamento de contas a receber (CR);
# Para um pagamento, o sistema permite o gerenciamento de contas a pagar (CP);
# Todas as contas possuem um tipo, convém frisar (TCP, TCR, TCF), que deverão ser informados no momento de lançamento da conta;
# Cada uma dessas contas (CP ou CR) possui um valor, uma data de vencimento, um parceiro (Fornecedor ou Cliente, respectivamente) e um status, com o objetivo de controle;
# O efetivo pagamento ou recebimento, quando registrado, gera uma atualização automática do saldo da respectiva conta;
# Para gerar o movimento de conta, deve haver uma transação (TX), que detém a condição de entidade associativa entre CF e uma CP ou CR;
# Em TX, poranto, deve haver um registro de CP ou CR,, valor, a CF e a data da transação;
# Não é preciso informar tipo de transação (Entrada ou Saída): se TX estiver ligada a CR, será de Entrada e, por outro lado, se for CP, Saída;
# Um valor de CR ou CP não necessariamente corresponde ao valor de TX. Valor de CR ou CP serve como estimativa de saldo em um dado momento. Valor de TX é que causa o incremento ou decremento em CF;
# As operações como saque ou depósito, que não precisam de um parceiro, podem ser lançadas no CPF/CNPJ da empresa; 
# Obviamente, uma transação deve estar ligada, por vez, a uma CP OU CR, não a ambas simultaneamente;
# CP ou CR não precisam de campos de efetivo pagamento ou recebimento, pois estará registrado na pŕopria transação a que se refiram;
# É necessário estar logado para utilizar as funcionalidades da aplicação;
# Uma vez logado, a sessão se encerra em 6 horas. A partir desse limite, é necessário efetuar novo login;
# Dentro de 'Gerenciar' há todas as funcionalidades necessárias à inclusão, exclusão, alteração e visualização de todas as entidades decritas acima;
`



function Manual() {

    const instructions = man
        .split('#')
        .map(instruction => instruction.trim())
        .filter(instruction => instruction.length > 0);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 4,
                px: 2,
                width: '100%',
                maxWidth: '70vw',
                maxHeight: '80vh',
                overflow: 'scroll',
                alignSelf: 'center',
            }}
        >
            <Typography variant="h2" component="h1" gutterBottom sx={{ mb: 4, color: 'primary.dark' }}>
                Manual de Instruções
            </Typography>
            
            <Grid container spacing={1}>
            
                {instructions.map((instruction, index) => {
                    if (index === 0 || (index + 1) % 4 === 0 || index % 4 === 0) {
                        return (
                            <Grid size={6} key={index}>
                                <Box
                                    sx={{
                                        p: 2,
                                        minHeight: 200,
                                        textAlign: 'left',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        bgcolor: 'primary.dark',
                                        color: 'white',
                                        borderRadius: 1
                                    }}
                                >
                                    <Typography  variant="body1" component="p" sx={{alignSelf: 'center', p: 4}}>
                                        {instruction}
                                    </Typography>
                                </Box>
                                
                            </Grid>
                        )
                    } else {
                        return (
                            <Grid size={6} key={index}>
                                <Box sx={{width: '100%', height: '100%'}}></Box>
                                <Divider/>
                            </Grid>
                        )
                    }
                    
                }
                )}
            
            </Grid>
            
        </Box>
    );
}

export default Manual;