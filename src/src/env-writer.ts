import * as fs from 'fs';
import * as path from 'path';

const envFilePath = path.join(process.cwd(), '.env');

export function saveUserToEnv(userData: {
  firstname: string;
  lastname: string;
  phone: string;
  age: number;
}) {
  let envContent = '';
  if (fs.existsSync(envFilePath)) {
    envContent = fs.readFileSync(envFilePath, 'utf-8');
  }

  const newLines = Object.entries(userData)
    .map(([key, value]) => `USER_${key.toUpperCase()}=${value}`)
    .join('\n');

  const updatedContent = envContent.trim() + '\n' + newLines + '\n';
  fs.writeFileSync(envFilePath, updatedContent, 'utf-8');
  console.log('Данные записаны в .env');
}