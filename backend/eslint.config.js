import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist"], // Ignora a pasta de saída
  },
  {
    files: ["**/*.{ts,tsx}"], // Aplica a configuração apenas a arquivos TypeScript
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: tsParser, // Define o parser do TypeScript
      globals: globals.node, // Define os globais para Node.js
    },
    plugins: {
      "@typescript-eslint": tseslint, // Adiciona o plugin do TypeScript
    },
    rules: {
      ...tseslint.configs.recommended.rules, // Regras recomendadas do TypeScript
      "no-console": "warn", // Emite um aviso para o uso de console.log
      "no-unused-vars": "off", // Desativa a regra padrão
      "@typescript-eslint/no-unused-vars": ["error"], // Usa a regra do TypeScript para variáveis não utilizadas
      "@typescript-eslint/explicit-function-return-type": "off", // Desativa a exigência de tipos explícitos em funções
    },
  },
];
