import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ToDo, ToDoSchema } from 'src/schema/todo.schema';
import { User, UserSchema } from 'src/schema/user.schema';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [TodoController],
  providers: [TodoService],
  imports: [
    MongooseModule.forFeature([
      {name: ToDo.name, schema: ToDoSchema}, 
      {name: User.name, schema: UserSchema}
    ]),
    UserModule
  ]
})
export class TodoModule {}
