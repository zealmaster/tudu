import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ToDo } from 'src/schema/todo.schema';
import { AddTaskDto } from './dto/add.dto';
import { User } from 'src/schema/user.schema';
import { UpdateTaskDto } from './dto/updateTask.dto';

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
    delete user.password;
    const newToDo = {
      author: user,
      title: data.title,
      description: data.description,
      dueDate: new Date(data?.dueDate),
    };
    const createToDo = new this.toDoModel(newToDo);

    return {
      success: true,
      msg: 'To do added.',
      added: await createToDo.save(),
    };
  }

  public async getTasksByUser(author: string, email: string) {
    const tasks = await this.toDoModel.find({ author });
    const shareWithMe = await this.toDoModel.find({ sharedWith: email });
    return {
      success: true,
      tasks: { ...tasks, ...shareWithMe },
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

  public async updateTask(id: string, data: UpdateTaskDto, email: string) {
    const taskId = new mongoose.Types.ObjectId(id);
    const taskExists = await this.toDoModel.findOne({ _id: taskId });
    if (!taskExists) return { success: false, message: 'Task does not exist' };

    const author = await this.userModel.findOne({ email });

    if (author.id == taskExists.author) {
      await this.toDoModel.updateOne(
        { _id: taskId },
        {
          $set: {
            title: data?.title,
            completed: data?.completed,
            description: data?.description,
            dueDate: data?.dueDate,
          },
        }
      );

      return {
        success: true,
        message: 'Task update successful.',
      };
    }
    return {
      success: false,
      message: 'Task update failed',
    };
  }

  public async deleteTask(id: string, email: string) {
    const taskId = new mongoose.Types.ObjectId(id);

    const taskExists = await this.toDoModel.findOne({ _id: taskId });
    if (!taskExists) return { success: false, message: 'Task does not exist' };

    const author = await this.userModel.findOne({ email });

    if (author.id == taskExists.author) {
      await this.toDoModel.deleteOne({ _id: taskId });
      return {
        success: true,
        message: 'Task delete successfull.',
      };
    }
    return {
      success: false,
      message: 'Task delete failed.',
    };
  }
}
