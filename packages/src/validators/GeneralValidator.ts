import { validate as isUuid } from 'uuid';
import { dateSchemaMaj, dateSchemaMin } from './utils/dateSchema.js';

export class GeneralValidator {
  public static validateCNPJ(cnpj: string): boolean {
    const cleanedCNPJ = cnpj.replace(/\D/g, '');

    if (cleanedCNPJ.length !== 14) {
      return false;
    }

    if (/^(\d)\1+$/.test(cleanedCNPJ)) {
      return false;
    }

    const calculateDigit = (cnpjPart: string, weights: number[]): number => {
      let sum = 0;
      for (let i = 0; i < weights.length; i++) {
        sum += parseInt(cnpjPart.charAt(i), 10) * weights[i];
      }
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const weightsFirst = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const firstDigit = calculateDigit(cleanedCNPJ.substring(0, 12), weightsFirst);

    if (firstDigit !== parseInt(cleanedCNPJ.charAt(12), 10)) {
      return false;
    }
    const weightsSecond = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const secondDigit = calculateDigit(cleanedCNPJ.substring(0, 13), weightsSecond);

    if (secondDigit !== parseInt(cleanedCNPJ.charAt(13), 10)) {
      return false;
    }

    return true;
  }

  public static validateCpf = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, '');

    if (!cpf || cpf.length !== 11 || /\D/g.test(cpf)) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    let sum = 0;
    let remainder: number;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) {
      return false;
    }

    return true;
  };

  public static validateMoneyNumber = (value: number): boolean => {
    if (!Number.isFinite(value)) {
      return false;
    }
    const multiplied = value * 100;
    return Math.abs(Math.round(multiplied) - multiplied) < 1e-9;
  };

  public static validateAndNormalizeMoneyString = (value: string): string | false => {
    try {
      if (!value || value.trim() === '') {
        return false;
      }

      const trimmed = value.trim();
      let parsedNumber: number = NaN;

      const rePtBr = /^\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?$|^\d+(?:,\d{1,2})?$/;
      const rePtBrInt = /^\d{1,3}(?:\.\d{3})*$|^\d+$/;

      if (rePtBr.test(trimmed) || rePtBrInt.test(trimmed)) {
        const normalized = trimmed.replace(/\./g, '').replace(',', '.');
        if (/^\d+(\.\d+)?$/.test(normalized) || /^\d+$/.test(normalized)) {
          parsedNumber = parseFloat(normalized);
        }
      } else {
        const reStandard = /^\d+(?:\.\d{1,2})?$|^\d+$/;
        if (reStandard.test(trimmed) && !trimmed.includes(',')) {
          parsedNumber = parseFloat(trimmed);
        }
      }
      if (
        !isNaN(parsedNumber) &&
        Number.isFinite(parsedNumber) &&
        parsedNumber >= 0.0 &&
        GeneralValidator.validateMoneyNumber(parsedNumber)
      ) {
        return parsedNumber.toFixed(2);
      }
      return false;
    } catch (error) {
      console.error('Erro ao validar a string monetária', error);
      return false;
    }
  };

  public static validateUUID = (cod: string): boolean => {
    if (!cod || !isUuid(cod)) {
      return false;
    }
    return true;
  };

  public static validateDateUntilPresent = (date: string): boolean => {
    try {
      const result = dateSchemaMin.safeParse(date);
      return result.success;
    } catch (error) {
      console.error('Erro ao validar data até o presente:', error);
      return false;
    }
  };

  public static validateDatePostPresent = (date: string): boolean => {
    try {
      const result = dateSchemaMaj.safeParse(date);
      return result.success;
    } catch (error) {
      console.error('Erro ao validar data após o presente:', error);
      return false;
    }
  };

  public static isValidPwd = (pwd: string): boolean => {
    // Expressão regular que valida:
    // - Pelo menos 8 caracteres
    // - Pelo menos uma letra minúscula
    // - Pelo menos uma letra maiúscula
    // - Pelo menos um dígito
    // - Pelo menos um caractere especial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,30}$/;
    return regex.test(pwd);
  };
}
