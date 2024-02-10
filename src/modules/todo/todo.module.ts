import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ToDo, ToDoSchema } from 'src/schema/todo.schema';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  controllers: [TodoController],
  providers: [TodoService],
  imports: [
    MongooseModule.forFeature([{name: ToDo.name, schema: ToDoSchema}])
  ]
})
export class TodoModule {}
