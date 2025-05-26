export const generateValidCPF = (): string => {
  const cpf = [];
  
  for (let i = 0; i < 9; i++) {
    cpf[i] = Math.floor(Math.random() * 10);
  }
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += cpf[i] * (10 - i);
  }
  let remainder = sum % 11;
  cpf[9] = remainder < 2 ? 0 : 11 - remainder;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += cpf[i] * (11 - i);
  }
  remainder = sum % 11;
  cpf[10] = remainder < 2 ? 0 : 11 - remainder;
  
  return cpf.join('');
};