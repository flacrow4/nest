import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Новый метод для сохранения данных в .env
  @Post('save-user-env')
  saveUser(@Body() body: any) {
    return this.appService.saveUserToEnv({
      firstname: body.firstname,
      lastname: body.lastname,
      phone: body.phone,
      age: body.age,
    });
  }
}