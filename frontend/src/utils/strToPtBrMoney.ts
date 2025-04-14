export function strToPtBrMoney(value: string): string {
  const apenasNumeros = value.replace(/\D/g, "");
  const valorFloat = (parseFloat(apenasNumeros) / 100).toFixed(2);
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(valorFloat));
}
