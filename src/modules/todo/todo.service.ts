import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToDo } from 'src/schema/todo.schema';
import { AddToDoDto } from './add.dto';

@Injectable()
export class TodoService {
    constructor(
        @InjectModel(ToDo.name)
        private toDoModel: Model<ToDo>
    ) {}

    public async addToDo(data: AddToDoDto) {
        const newToDo = {
            title: data.title,
            description: data.description,
            dueDate: data?.dueDate,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const createToDo = new this.toDoModel(newToDo);
        
        return {
            success: true, 
            msg: 'To do added.',
            added: await createToDo.save()
        }
    }
}
