import * as dree from 'dree';
import { ScanOptions } from 'dree';
import * as fs from 'fs';
import * as path from 'path';

interface CustomResult extends dree.Dree {
  description: string;
}
const options: ScanOptions = {
  stat: false,
  normalize: true,
  followLinks: false,
  size: false,
  hash: false,
  depth: 5,
  exclude: [
    '**/node_modules',    
    '**/node_modules/**', 
    '**/dist',            
    '**/dist/**',      
    '**/build',          
    '**/build/**',     
    '**/coverage',       
    '**/coverage/**',    
    '**/out',
    '**/out/**',
    '**/tmp',
    '**/tmp/**',
    '**/.git',
    '**/.git/**',
    '**/.vscode',
    '**/.vscode/**',
    'projectTree.txt'
  ],
  extensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'md',
    'html',
    'css',
    'png',
    'jpg',
    'jpeg',
    'gif',
    'svg',
    '.prettierrc',
    '.eslintrc',
    '.gitignore',
    'LICENSE'
 ],
};

const fileCallback: dree.Callback<CustomResult> = function (node, stat) {
  node.description = `${node.name}`;
};

const dirCallback: dree.Callback<CustomResult> = function (node, stat) {
  node.description = `${node.name}`;
};

try {
  const tree: CustomResult = dree.scan<CustomResult>('./', options, fileCallback, dirCallback);

  const stringOutput = dree.parseTree(tree);


  const outputPath = path.join(__dirname, 'docs', 'projectTree.txt');

  fs.writeFileSync(outputPath, stringOutput, 'utf8');

  console.log(`Árvore do projeto salva em: ${outputPath}`);
} catch (error) {
  console.error('Erro ao gerar a árvore do projeto:', error);
  process.exit(1);
};
