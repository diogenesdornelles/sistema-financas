import GeneralValidator from '../validators/general.validator'

describe('GeneralValidator', () => {
  describe('validateCNPJ', () => {
    it('should return true for a valid CNPJ 1', () => {
      expect(GeneralValidator.validateCNPJ('11.444.777/0001-61')).toBe(true);
    });

    it('should return true for a valid CNPJ 2', () => {
        expect(GeneralValidator.validateCNPJ('11444777000161')).toBe(true);
      });

    it('should return false for an invalid CNPJ', () => {
      expect(GeneralValidator.validateCNPJ('11.444.777/0001-00')).toBe(false);
    });

    it('should return false for repeated digits', () => {
      expect(GeneralValidator.validateCNPJ('11.111.111/1111-11')).toBe(false);
    });
  });

  describe('validateCpf', () => {
    it('should return true for a valid CPF 1', () => {
      expect(GeneralValidator.validateCpf('52998224725')).toBe(true);
    });

    it('should return true for a valid CPF 2', () => {
        expect(GeneralValidator.validateCpf('529.982.247-25')).toBe(true);
      });

    it('should return false for an invalid CPF', () => {
      expect(GeneralValidator.validateCpf('12345678900')).toBe(false);
    });

    it('should return false for CPF with letters', () => {
      expect(GeneralValidator.validateCpf('abc12345678')).toBe(false);
    });
  });

  describe('validateMoneyNumber', () => {
    it('should return true for a valid money number', () => {
      expect(GeneralValidator.validateMoneyNumber(123.45)).toBe(true);
    });

    it('should return false for an invalid money number (more than 2 decimals)', () => {
      expect(GeneralValidator.validateMoneyNumber(123.456)).toBe(false);
    });

    it('should return false for NaN or non-finite values', () => {
      expect(GeneralValidator.validateMoneyNumber(NaN)).toBe(false);
      expect(GeneralValidator.validateMoneyNumber(Infinity)).toBe(false);
    });
  });

  describe('validateAndNormalizeMoneyString', () => {
    it('should parse BR formatted value correctly 1', () => {
      expect(GeneralValidator.validateAndNormalizeMoneyString('1.234,56')).toBe('1234.56');
    });

    it('should parse BR formatted value correctly 2', () => {
        expect(GeneralValidator.validateAndNormalizeMoneyString('4,56')).toBe('4.56');
      });

      it('should parse BR formatted value correctly 3', () => {
        expect(GeneralValidator.validateAndNormalizeMoneyString('4,5')).toBe('4.50');
      });

      it('should parse BR formatted value correctly 4', () => {
        expect(GeneralValidator.validateAndNormalizeMoneyString('1.231.234,56')).toBe('1231234.56');
      });

    it('should parse standard formatted value correctly 1', () => {
      expect(GeneralValidator.validateAndNormalizeMoneyString('1234.56')).toBe('1234.56');
    });

    it('should parse standard formatted value correctly 2', () => {
        expect(GeneralValidator.validateAndNormalizeMoneyString('1234.5')).toBe('1234.50');
      });

    it('should return false for badly formatted values', () => {
      expect(GeneralValidator.validateAndNormalizeMoneyString('12,34.56')).toBe(false);
      expect(GeneralValidator.validateAndNormalizeMoneyString('abc')).toBe(false);
    });
  });

  describe('validateUUID', () => {
    it('should return true for a valid UUID', () => {
      expect(GeneralValidator.validateUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should return false for an invalid UUID', () => {
      expect(GeneralValidator.validateUUID('invalid-uuid')).toBe(false);
    });
  });

  describe('validateDateUntilPresent', () => {
    it('should return true for valid past date', () => {
      expect(GeneralValidator.validateDateUntilPresent('2023-12-01')).toBe(true);
    });

    it('should return false for future date', () => {
      expect(GeneralValidator.validateDateUntilPresent('2999-01-01')).toBe(false);
    });
  });

  describe('validateDatePostPresent', () => {
    it('should return true for valid future date', () => {
      expect(GeneralValidator.validateDatePostPresent('2999-01-01')).toBe(true);
    });

    it('should return false for past date', () => {
      expect(GeneralValidator.validateDatePostPresent('2020-01-01')).toBe(false);
    });
  });

  describe('isValidPwd', () => {
    it('should return true for strong password', () => {
      expect(GeneralValidator.isValidPwd('Aa123456!')).toBe(true);
    });

    it('should return false for weak password (missing uppercase)', () => {
      expect(GeneralValidator.isValidPwd('aa123456!')).toBe(false);
    });

    it('should return false for too short password', () => {
      expect(GeneralValidator.isValidPwd('A1!a')).toBe(false);
    });
  });
});
