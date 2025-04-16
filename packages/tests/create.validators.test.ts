import { createCatSchema } from '../validators/zod-schemas/create/create-cat.validator'
import { createCfSchema } from '../validators/zod-schemas/create/create-cf.validator'
import { createCpSchema } from '../validators/zod-schemas/create/create-cp.validator'
import { createCrSchema } from '../validators/zod-schemas/create/create-cr.validator'
import { createPartnerSchema } from '../validators/zod-schemas/create/create-partner.validator'
import { createTcfSchema } from '../validators/zod-schemas/create/create-tcf.validator'
import { createTcrSchema } from '../validators/zod-schemas/create/create-tcr.validator'
import { createTcpSchema } from '../validators/zod-schemas/create/create-tcp.validator'
import { createTxSchema } from '../validators/zod-schemas/create/create-tx.validator'
import { createTokenSchema } from '../validators/zod-schemas/create/create-token.validator'
import { createUserSchema } from '../validators/zod-schemas/create/create-user.validator'
import { createUserRepPwdSchema } from '../validators/zod-schemas/create/create-user-rep-pwd.validator'
import { PartnerType } from '../dtos/utils/enums'



describe('Schema Tests', () => {
    describe('createCatSchema', () => {
        const validData = {
            name: 'Nome válido',
            user: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        };

        it('should pass validation with valid data', () => {
            expect(() => createCatSchema.parse(validData)).not.toThrow();
        });

        it('should fail validation if name is too short', () => {
            expect(() => createCatSchema.parse({ ...validData, name: 'ab' })).toThrow(
                'Nome precisa ter ao menos 3 caracteres'
            );
        });

        it('should fail validation if name is too long', () => {
            expect(() =>
                createCatSchema.parse({ ...validData, name: 'a'.repeat(101) })
            ).toThrow('Nome pode ter no máximo 100 caracteres');
        });

        it('should pass validation if description is within the limit', () => {
            expect(() =>
                createCatSchema.parse({ ...validData, description: 'Descrição válida' })
            ).not.toThrow();
        });

        it('should fail validation if description is too long', () => {
            expect(() =>
                createCatSchema.parse({ ...validData, description: 'a'.repeat(256) })
            ).toThrow('Descrição pode ter no máximo 255 caracteres');
        });

        it('should pass validation if obs is within the limit', () => {
            expect(() =>
                createCatSchema.parse({ ...validData, obs: 'Observação válida' })
            ).not.toThrow();
        });

        it('should fail validation if obs is too long', () => {
            expect(() =>
                createCatSchema.parse({ ...validData, obs: 'a'.repeat(256) })
            ).toThrow('Observação pode ter no máximo 255 caracteres');
        });

        it('should fail validation if user is not a valid UUID', () => {
            expect(() =>
                createCatSchema.parse({ ...validData, user: 'invalid-uuid' })
            ).toThrow('Informar o usuário');
        });
    });

    describe('createCfSchema', () => {
        const validData = {
            number: '12345',
            balance: '100.50',
            type: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            user: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        };

        it('should pass validation with valid data', () => {
            expect(() => createCfSchema.parse(validData)).not.toThrow();
        });

        it('should fail validation if number is too short', () => {
            expect(() => createCfSchema.parse({ ...validData, number: 'ab' })).toThrow(
                'Número precisa ter ao menos 3 caracteres'
            );
        });

        it('should fail validation if number is too long', () => {
            expect(() =>
                createCfSchema.parse({ ...validData, number: 'a'.repeat(11) })
            ).toThrow('Número precisa ter no máximo 10 caracteres');
        });

        it('should pass validation if ag is within the limit', () => {
            expect(() =>
                createCfSchema.parse({ ...validData, ag: '1234567890' })
            ).not.toThrow();
        });

        it('should fail validation if ag is too long', () => {
            expect(() =>
                createCfSchema.parse({ ...validData, ag: 'a'.repeat(11) })
            ).toThrow('Agência precisa ter no máximo 10 caracteres');
        });

        it('should pass validation if bank is within the limit', () => {
            expect(() =>
                createCfSchema.parse({ ...validData, bank: 'Banco exemplo limitado a 30' })
            ).not.toThrow();
        });

        it('should fail validation if bank is too long', () => {
            expect(() =>
                createCfSchema.parse({ ...validData, bank: 'a'.repeat(31) })
            ).toThrow('Banco precisa ter no máximo 30 caracteres');
        });

        it('should fail validation if balance is missing', () => {
            expect(() => createCfSchema.parse({ ...validData, balance: undefined })).toThrow(
                'valor é obrigatório'
            );
        });

        it('should fail validation if type is not a valid UUID', () => {
            expect(() =>
                createCfSchema.parse({ ...validData, type: 'invalid-uuid' })
            ).toThrow('Informar o tipo');
        });

        it('should fail validation if user is not a valid UUID', () => {
            expect(() =>
                createCfSchema.parse({ ...validData, user: 'invalid-uuid' })
            ).toThrow('Informar o usuário');
        });

        it('should pass validation if obs is within the limit', () => {
            expect(() =>
                createCfSchema.parse({ ...validData, obs: 'Observação válida' })
            ).not.toThrow();
        });

        it('should fail validation if obs is too long', () => {
            expect(() =>
                createCfSchema.parse({ ...validData, obs: 'a'.repeat(256) })
            ).toThrow('Observação pode ter no máximo 255 caracteres');
        });
    });

    describe('createCpSchema', () => {
        const validData = {
            value: '50.00',
            due: '2040-02-01',
            type: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            user: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            supplier: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        };

        it('should pass validation with valid data', () => {
            expect(() => createCpSchema.parse(validData)).not.toThrow();
        });

        it('should fail validation if value is missing', () => {
            expect(() => createCpSchema.parse({ ...validData, value: undefined })).toThrow(
                'valor é obrigatório'
            );
        });

        it('should fail validation if due date is in the past', () => {
            const pastDate = '2023-02-01'
            expect(() => createCpSchema.parse({ ...validData, due: pastDate })).toThrow(
                'A data de vencimento deve ser maior ou igual a data atual.'
            );
        });

        it('should fail validation if type is not a valid UUID', () => {
            expect(() =>
                createCpSchema.parse({ ...validData, type: 'invalid-uuid' })
            ).toThrow('Informar o tipo');
        });

        it('should fail validation if user is not a valid UUID', () => {
            expect(() =>
                createCpSchema.parse({ ...validData, user: 'invalid-uuid' })
            ).toThrow('Informar o usuário');
        });

        it('should fail validation if supplier is not a valid UUID', () => {
            expect(() =>
                createCpSchema.parse({ ...validData, supplier: 'invalid-uuid' })
            ).toThrow('Informar o fornecedor');
        });

        it('should pass validation if obs is within the limit', () => {
            expect(() =>
                createCpSchema.parse({ ...validData, obs: 'Observação válida' })
            ).not.toThrow();
        });

        it('should fail validation if obs is too long', () => {
            expect(() =>
                createCpSchema.parse({ ...validData, obs: 'a'.repeat(256) })
            ).toThrow('Observação pode ter no máximo 255 caracteres');
        });
    });

    describe('createCrSchema', () => {
        const validData = {
            value: '100.00',
            due: '2030-02-08',
            type: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            user: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            customer: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        };

        it('should pass validation with valid data', () => {
            expect(() => createCrSchema.parse(validData)).not.toThrow();
        });

        it('should fail validation if value is missing', () => {
            expect(() => createCrSchema.parse({ ...validData, value: undefined })).toThrow(
                'valor é obrigatório'
            );
        });

        it('should fail validation if due date is in the past', () => {
            const pastDate = '2020-04-05'
            expect(() => createCrSchema.parse({ ...validData, due: pastDate })).toThrow(
                'A data de vencimento deve ser maior ou igual a data atual.'
            );
        });

        it('should fail validation if type is not a valid UUID', () => {
            expect(() =>
                createCrSchema.parse({ ...validData, type: 'invalid-uuid' })
            ).toThrow('Informar o tipo');
        });

        it('should fail validation if user is not a valid UUID', () => {
            expect(() =>
                createCrSchema.parse({ ...validData, user: 'invalid-uuid' })
            ).toThrow('Informar o usuário');
        });

        it('should fail validation if customer is not a valid UUID', () => {
            expect(() =>
                createCrSchema.parse({ ...validData, customer: 'invalid-uuid' })
            ).toThrow('Informar o cliente');
        });

        it('should pass validation if obs is within the limit', () => {
            expect(() =>
                createCrSchema.parse({ ...validData, obs: 'Observação válida' })
            ).not.toThrow();
        });

        it('should fail validation if obs is too long', () => {
            expect(() =>
                createCrSchema.parse({ ...validData, obs: 'a'.repeat(256) })
            ).toThrow('Observação pode ter no máximo 255 caracteres');
        });
    });

    describe('createPartnerSchema', () => {
        const validPfData = {
            name: 'João da Silva',
            cod: '00480171084',
            type: PartnerType.PF,
            user: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        };

        const validPjData = {
            name: 'Empresa Exemplo LTDA',
            cod: '33113309000147',
            type: PartnerType.PJ,
            user: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        };

        it('should pass validation with valid PF data', () => {
            expect(() => createPartnerSchema.parse(validPfData)).not.toThrow();
        });

        it('should pass validation with valid PJ data', () => {
            expect(() => createPartnerSchema.parse(validPjData)).not.toThrow();
        });

        it('should fail validation if name is too short', () => {
            expect(() => createPartnerSchema.parse({ ...validPfData, name: 'ab' })).toThrow(
                'Nome precisa ter ao menos 3 caracteres'
            );
        });

        it('should fail validation if name is too long', () => {
            expect(() =>
                createPartnerSchema.parse({ ...validPfData, name: 'a'.repeat(101) })
            ).toThrow('Nome pode ter no máximo 100 caracteres');
        });

        it('should pass validation if cod has non-digit characters (they should be removed)', () => {
            expect(() =>
                createPartnerSchema.parse({ ...validPfData, cod: '004.801.710-84' })
            ).not.toThrow();
            expect(() =>
                createPartnerSchema.parse({ ...validPjData, cod: '33.113.309/0001-47' })
            ).not.toThrow();
        });


        it('should fail validation if type is PF and CPF is invalid', () => {
            const result = createPartnerSchema.safeParse({ 
                ...validPfData, 
                cod: '11111111111'
            });
            expect(result.success).toBe(false);
        });

        it('should fail validation if type is PJ and CNPJ is invalid', () => {
            const result = createPartnerSchema.safeParse({ 
                ...validPjData, 
                cod: '11111aaa111111'
            });
            expect(result.success).toBe(false);
        });

        it('should fail validation if type is PF and cod length is not 11', () => {
            const result = createPartnerSchema.safeParse({ 
                ...validPfData, cod: '1234567890123'
           });
           expect(result.success).toBe(false);
        });

        it('should fail validation if type is PJ and cod length is not 14', () => {

            const result = createPartnerSchema.safeParse({ 
                 ...validPjData, cod: '1234567890123'
            });
            expect(result.success).toBe(false);
        });

        it('should fail validation if user is not a valid UUID', () => {
            expect(() =>
                createPartnerSchema.parse({ ...validPfData, user: 'invalid-uuid' })
            ).toThrow('Informar o usuário');
        });

        it('should pass validation if obs is within the limit', () => {
            expect(() =>
                createPartnerSchema.parse({ ...validPfData, obs: 'Observação válida' })
            ).not.toThrow();
        });

        it('should fail validation if obs is too long', () => {
            expect(() =>
                createPartnerSchema.parse({ ...validPfData, obs: 'a'.repeat(256) })
            ).toThrow('Observação pode ter no máximo 255 caracteres');
        });
    });

    describe('createTcfSchema', () => {
        const validData = { name: 'Categoria Financeira Válida' };

        it('should pass validation with valid data', () => {
            expect(() => createTcfSchema.parse(validData)).not.toThrow();
        });

        it('should fail validation if name is too short', () => {
            expect(() => createTcfSchema.parse({ name: 'ab' })).toThrow(
                'Nome pode ter ao menos 3 caracteres'
            );
        });

        it('should fail validation if name is too long', () => {
            expect(() => createTcfSchema.parse({ name: 'a'.repeat(256) })).toThrow(
                'Nome pode ter no máximo 255 caracteres'
            );
        });
    });

    describe('createTcpSchema', () => {
        const validData = { name: 'Tipo de Pagamento Válido' };

        it('should pass validation with valid data', () => {
            expect(() => createTcpSchema.parse(validData)).not.toThrow();
        });

        it('should fail validation if name is too short', () => {
            expect(() => createTcpSchema.parse({ name: 'ab' })).toThrow(
                'Nome pode ter ao menos 3 caracteres'
            );
        });

        it('should fail validation if name is too long', () => {
            expect(() => createTcpSchema.parse({ name: 'a'.repeat(256) })).toThrow(
                'Nome pode ter no máximo 255 caracteres'
            );
        });
    });

    describe('createTcrSchema', () => {
        const validData = { name: 'Tipo de Recebimento Válido' };

        it('should pass validation with valid data', () => {
            expect(() => createTcrSchema.parse(validData)).not.toThrow();
        });

        it('should fail validation if name is too short', () => {
            expect(() => createTcrSchema.parse({ name: 'ab' })).toThrow(
                'Nome pode ter ao menos 3 caracteres'
            );
        });

        it('should fail validation if name is too long', () => {
            expect(() => createTcrSchema.parse({ name: 'a'.repeat(256) })).toThrow(
                'Nome pode ter no máximo 255 caracteres'
            );
        });
    });

    describe('createTokenSchema', () => {
        const validData = { cpf: '00480171084', pwd: 'SenhaForte123@' };

        it('should pass validation with valid data', () => {
            expect(() => createTokenSchema.parse(validData)).not.toThrow();
        });

        it('should pass validation if cpf has non-digit characters (they should be removed)', () => {
            expect(() => createTokenSchema.parse({ ...validData, cpf: '004.801.710-84' })).not.toThrow();
        });

        it('should fail validation if cpf is in invalid format', () => {
            expect(() => createTokenSchema.parse({ ...validData, cpf: '12345' })).toThrow(
                'CPF em formato inválido.'
            );
        });

        it('should fail validation if password does not meet criteria', () => {
            expect(() => createTokenSchema.parse({ ...validData, pwd: 'senhafraca' })).toThrow();
            expect(() => createTokenSchema.parse({ ...validData, pwd: 'SENHAFORTE' })).toThrow();
            expect(() => createTokenSchema.parse({ ...validData, pwd: 'senhaforte' })).toThrow();
            expect(() => createTokenSchema.parse({ ...validData, pwd: 'Senha123' })).toThrow();
            expect(() => createTokenSchema.parse({ ...validData, pwd: 'SenhaForte' })).toThrow();
            expect(() => createTokenSchema.parse({ ...validData, pwd: 'SenhaForte@1' })).not.toThrow(); // Should pass
        });
    });

    describe('createTxSchema', () => {
        const validDataCp = {
            value: '25.00',
            user: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            cf: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            cp: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            category: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            tdate: '2024-04-03',
            description: 'Compra no supermercado',
        };

        const validDataCr = {
            value: '75.00',
            user: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            cf: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            cr: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            category: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            tdate: '2024-04-03',
            description: 'Pagamento de cliente',
        };

        it('should pass validation with valid data (with cp)', () => {
            expect(() => createTxSchema.parse(validDataCp)).not.toThrow();
        });

        it('should pass validation with valid data (with cr)', () => {
            expect(() => createTxSchema.parse(validDataCr)).not.toThrow();
        });

        it('should fail validation if value is missing', () => {
            expect(() => createTxSchema.parse({ ...validDataCp, value: undefined })).toThrow(
                'valor é obrigatório'
            );
        });

        it('should fail validation if user is not a valid UUID', () => {
            expect(() => createTxSchema.parse({ ...validDataCp, user: 'invalid-uuid' })).toThrow(
                'Informar o usuário (UUID)'
            );
        });

        it('should fail validation if cf is not a valid UUID', () => {
            expect(() => createTxSchema.parse({ ...validDataCp, cf: 'invalid-uuid' })).toThrow(
                'Informar a conta financeira (UUID)'
            );
        });

        it('should fail validation if cp is not a valid UUID', () => {
            expect(() => createTxSchema.parse({ ...validDataCp, cp: 'invalid-uuid' })).toThrow(
                'A conta de pagamento (cp) deve ser um UUID válido'
            );
        });

        it('should fail validation if cr is not a valid UUID', () => {
            expect(() => createTxSchema.parse({ ...validDataCr, cr: 'invalid-uuid' })).toThrow(
                'A conta de recebimento (cr) deve ser um UUID válido'
            );
        });

        it('should fail validation if category is not a valid UUID', () => {
            expect(() => createTxSchema.parse({ ...validDataCp, category: 'invalid-uuid' })).toThrow(
                'Informar a categoria (UUID)'
            );
        });

        it('should fail validation if tdate is in the future', () => {
            const futureDate = '2040-01-02'
            expect(() => createTxSchema.parse({ ...validDataCp, tdate: futureDate })).toThrow(
                'A data de transação deve ser válida e menor ou igual à data atual.'
            );
        });

        it('should pass validation if obs is within the limit', () => {
            expect(() => createTxSchema.parse({ ...validDataCp, obs: 'Observação válida' })).not.toThrow();
        });

        it('should fail validation if obs is too long', () => {
            expect(() => createTxSchema.parse({ ...validDataCp, obs: 'a'.repeat(256) })).toThrow(
                'Observação pode ter no máximo 255 caracteres'
            );
        });

        it('should pass validation if description is within the limit', () => {
            expect(() =>
                createTxSchema.parse({ ...validDataCp, description: 'Descrição válida' })
            ).not.toThrow();
        });

        it('should fail validation if description is too long', () => {
            expect(() =>
                createTxSchema.parse({ ...validDataCp, description: 'a'.repeat(101) })
            ).toThrow('Descrição pode ter no máximo 100 caracteres');
        });

        it('should fail validation if neither cp nor cr is provided', () => {
            const dataWithoutCpCr = { ...validDataCp, cp: undefined, cr: undefined };
            expect(() => createTxSchema.parse(dataWithoutCpCr)).toThrow(
                'É necessário informar uma conta: de pagamento (cp) OU de recebimento (cr).'
            );
        });

        it('should fail validation if both cp and cr are provided', () => {
            expect(() => createTxSchema.parse({ ...validDataCp, cr: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })).toThrow(
                'Apenas uma conta deve ser informada: de pagamento (cp) OU de recebimento (cr).'
            );
        });
    });

    describe('createUserRepPwdSchema', () => {
        const validData = {
            name: 'Nome',
            surname: 'Sobrenome',
            pwd: 'SenhaForte123@',
            confirmPwd: 'SenhaForte123@',
            cpf: '00480171084',
        };

        it('should pass validation with valid data', () => {
            expect(() => createUserRepPwdSchema.parse(validData)).not.toThrow();
        });

        it('should fail validation if passwords do not match', () => {
            expect(() =>
                createUserRepPwdSchema.parse({ ...validData, confirmPwd: 'SenhaDiferente' })
            ).toThrow('As senhas devem ser iguais');
        });

        // Reuse tests from createUserSchema for other fields
        it('should fail validation if name is too short', () => {
            expect(() => createUserRepPwdSchema.parse({ ...validData, name: 'ab' })).toThrow(
                'Nome precisa ter ao menos 3 caracteres'
            );
        });

        it('should fail validation if cpf is invalid', () => {
            expect(() => createUserRepPwdSchema.parse({ ...validData, cpf: '123' })).toThrow(
                'CPF inválido'
            );
        });

        it('should fail validation if pwd does not meet criteria', () => {
            expect(() => createUserRepPwdSchema.parse({ ...validData, pwd: 'senhafraca', confirmPwd: 'senhafraca' })).toThrow();
        });
    });

    describe('createUserSchema', () => {
        const validData = {
            name: 'Nome',
            surname: 'Sobrenome',
            pwd: 'SenhaForte123@',
            cpf: '00480171084',
        };

        it('should pass validation with valid data', () => {
            expect(() => createUserSchema.parse(validData)).not.toThrow();
        });

        it('should fail validation if name is too short', () => {
            expect(() => createUserSchema.parse({ ...validData, name: 'ab' })).toThrow(
                'Nome precisa ter ao menos 3 caracteres'
            );
        });

        it('should fail validation if name is too long', () => {
            expect(() => createUserSchema.parse({ ...validData, name: 'a'.repeat(256) })).toThrow(
                'Nome pode ter no máximo 255 caracteres'
            );
        });

        it('should fail validation if surname is too short', () => {
            expect(() => createUserSchema.parse({ ...validData, surname: 'ab' })).toThrow(
                'Sobrenome precisa ter ao menos 3 caracteres'
            );
        });

        it('should fail validation if surname is too long', () => {
            expect(() => createUserSchema.parse({ ...validData, surname: 'a'.repeat(256) })).toThrow(
                'Sobrenome pode ter no máximo 255 caracteres'
            );
        });

        it('should fail validation if pwd does not meet criteria', () => {
            expect(() => createUserSchema.parse({ ...validData, pwd: 'senhafraca' })).toThrow();
        });

        it('should pass validation if cpf has non-digit characters (they should be removed)', () => {
            expect(() => createUserSchema.parse({ ...validData, cpf: '004.801.710-84' })).not.toThrow();
        });

        it('should fail validation if cpf is invalid', () => {
            expect(() => createUserSchema.parse({ ...validData, cpf: '123' })).toThrow(
                'CPF inválido'
            );
        });
    });
});