import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TodoModule } from './modules/todo/todo.module';
import { EmailModule } from './modules/email/email.module';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import * as dotenv from 'dotenv';

dotenv.config()

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGOOSE_URI), 
    UserModule, 
    AuthModule, 
    TodoModule, 
    EmailModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
