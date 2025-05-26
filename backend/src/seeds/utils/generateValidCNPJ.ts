export const generateValidCNPJ = (): string => {
  const cnpj = [];

  for (let i = 0; i < 12; i++) {
    cnpj[i] = Math.floor(Math.random() * 10);
  }
  
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += cnpj[i] * weights1[i];
  }
  let remainder = sum % 11;
  cnpj[12] = remainder < 2 ? 0 : 11 - remainder;
  
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += cnpj[i] * weights2[i];
  }
  remainder = sum % 11;
  cnpj[13] = remainder < 2 ? 0 : 11 - remainder;
  
  return cnpj.join('');
};