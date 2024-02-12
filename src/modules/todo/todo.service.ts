import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ToDo } from 'src/schema/todo.schema';
import { AddTaskDto } from './dto/add.dto';
import { User } from 'src/schema/user.schema';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(ToDo.name)
    private toDoModel: Model<ToDo>,
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  public async addToDo(email: string, data: AddTaskDto) {
    const user = await this.userModel.findOne({ email });
    const newToDo = {
      userId: user.id,
      title: data.title,
      description: data.description,
      dueDate: new Date(data?.dueDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createToDo = new this.toDoModel(newToDo);

    return {
      success: true,
      msg: 'To do added.',
      added: await createToDo.save(),
    };
  }

  public async getTasksByUser(userId: string) {
    const tasks = await this.toDoModel.find({ userId });
    return {
      success: true,
      tasks,
    };
  }

  public async shareTask(userId: string, email: string, taskIdObject: { id: string }) {
    try {
      const emailExists = await this.userModel.findOne({ email });

      if (!emailExists) {
        return { success: false, message: 'User does not exist.' };
      }

      const taskId = new mongoose.Types.ObjectId(taskIdObject.id); // Convert taskId to ObjectId
      const task = await this.toDoModel.findOne({ userId, _id: taskId }).lean();

      if (!task) {
        return {
          success: false,
          message: 'Task not found for the given user.',
        };
      }

      if (task.sharedWith.length == undefined) task.sharedWith = [];

      if (task.sharedWith.includes(email)) {
        return {
          success: false,
          message: 'Task is already shared with this user.',
        };
      }

      await this.toDoModel.updateOne({ _id: taskId }, { $push: { sharedWith: email } });

      return {
        success: true,
        message: 'Task shared successfully.',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error sharing the task.',
        error: error.message,
      };
    }
  }
}
