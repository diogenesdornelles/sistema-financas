export const optionsCpsCrs = {
  plugins: {
    title: {
      display: true,
      text: 'Contas a vencer nos próximos 30 dias', // Adjusted title
    },
  },
  responsive: true,
  maintainAspectRatio: false, // Allow chart to resize vertically
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

// Pie chart options (optional, but good practice)
export const optionsPie = {
  plugins: {
    title: {
      display: true, // Title is handled by Typography above the chart
      text: 'Saldo por Conta', // Example if you wanted chart title
    },
    legend: {
      position: 'top' as const,
    },
  },
  responsive: true,
  maintainAspectRatio: false, // Allow chart to resize vertically
};

export const colors = [
  '#E3F2FD',
  '#BBDEFB',
  '#90CAF9',
  '#64B5F6',
  '#42A5F5',
  '#2196F3',
  '#1E88E5',
  '#1976D2',
  '#1565C0',
  '#0D47A1',
];
