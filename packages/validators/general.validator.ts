import { validate as isUuid } from "uuid";
import { dateSchemaMaj, dateSchemaMin } from "./utils/date-schema";

export default class GeneralValidator {
  public static validateCNPJ(cnpj: string): boolean {
    // Remove todos os caracteres que não são dígitos
    const cleanedCNPJ = cnpj.replace(/\D/g, "");

    // Verifica se possui 14 dígitos
    if (cleanedCNPJ.length !== 14) {
      return false;
    }

    // Verifica se todos os dígitos são iguais (ex.: "00000000000000")
    if (/^(\d)\1+$/.test(cleanedCNPJ)) {
      return false;
    }

    // Função auxiliar para calcular o dígito verificador
    const calculateDigit = (cnpjPart: string, weights: number[]): number => {
      let sum = 0;
      for (let i = 0; i < weights.length; i++) {
        sum += parseInt(cnpjPart.charAt(i), 10) * weights[i];
      }
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    // Cálculo do primeiro dígito verificador (para os 12 primeiros dígitos)
    const weightsFirst = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const firstDigit = calculateDigit(
      cleanedCNPJ.substring(0, 12),
      weightsFirst,
    );

    if (firstDigit !== parseInt(cleanedCNPJ.charAt(12), 10)) {
      return false;
    }

    // Cálculo do segundo dígito verificador (para os 13 primeiros dígitos, incluindo o primeiro dígito verificador)
    const weightsSecond = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const secondDigit = calculateDigit(
      cleanedCNPJ.substring(0, 13),
      weightsSecond,
    );

    if (secondDigit !== parseInt(cleanedCNPJ.charAt(13), 10)) {
      return false;
    }

    return true;
  }
  public static validateCpf = (cpf: string): boolean => {
    if (!cpf || cpf.length !== 11 || /\D/g.test(cpf)) {
      return false;
    }

    let sum = 0;
    let remainder: number;

    // Validação do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return false;
    }

    sum = 0;
    // Validação do segundo dígito verificador
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

  public static validateUUID = (cod: string): boolean => {
    if (!cod || !isUuid(cod)) {
      return false;
    }
    return true;
  };

  public static validateDateUntilPresent = (date: string): boolean => {
    try {
      const parsedDate = dateSchemaMin.parse(date);
      return !!parsedDate;
    } catch (error) {
      console.error("Erro ao validar data até o presente:", error);
      return false;
    }
  };


  public static validateDatePostPresent = (date: string): boolean => {
    try {
      const parsedDate = dateSchemaMaj.parse(date);
      return !!parsedDate;
    } catch (error) {
      console.error("Erro ao validar data após o presente:", error);
      return false;
    }
  };


  public static validateMoney = (value: number): boolean => {
    return Number.isInteger(value * 100);
  };

  public static isValidPwd = (pwd: string): boolean => {
    // Expressão regular que valida:
    // - Pelo menos 8 caracteres
    // - Pelo menos uma letra minúscula
    // - Pelo menos uma letra maiúscula
    // - Pelo menos um dígito
    // - Pelo menos um caractere especial
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,30}$/;
    return regex.test(pwd);
  };
}
