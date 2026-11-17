import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  saveUserToEnv(userData: { firstname: string; lastname: string; phone: string; age: number }) {
    const envFilePath = path.join(process.cwd(), '.env');

    let envContent = '';
    if (fs.existsSync(envFilePath)) {
      envContent = fs.readFileSync(envFilePath, 'utf-8');
    }

    const newLines = Object.entries(userData)
      .map(([key, value]) => `USER_${key.toUpperCase()}=${value}`)
      .join('\n');

    const updatedContent = envContent.trim() + '\n' + newLines + '\n';
    fs.writeFileSync(envFilePath, updatedContent, 'utf-8');

    return { message: 'Данные успешно записаны в .env' };
  }
}