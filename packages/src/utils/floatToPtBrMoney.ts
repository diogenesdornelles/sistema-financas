export function floatToPtBrMoney(value: number): string {
  if (isNaN(value)) {
    return '0,00'; // Retorna um valor padrão se o número for inválido
  }

  return value
    .toFixed(2) // Garante duas casas decimais
    .replace('.', ',') // Substitui o ponto pelo separador decimal brasileiro
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona separadores de milhares
}
