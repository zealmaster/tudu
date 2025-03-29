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
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  public async getTasksByUser(author: string, email: string) {
    try {
      const tasks = await this.toDoModel.find({ author });
      const shareWithMe = await this.toDoModel.find({ sharedWith: email });
      return {
        success: true,
        tasks: { ...tasks, ...shareWithMe },
      };
    } catch (error) {
      console.log(error);
    }
  }

  public async shareTask(data: { userId: string; email: string; taskId: string }) {
    try {
      const emailExists = await this.userModel.findOne({ email: data.email });

      if (!emailExists) {
        return { success: false, message: 'User does not exist.' };
      }

      const taskId = new mongoose.Types.ObjectId(data.taskId); // Convert taskId to ObjectId
      const task = await this.toDoModel.findOne({ userId: data.userId, _id: taskId }).lean();

      if (!task) {
        return {
          success: false,
          message: 'Task not found for the given user.',
        };
      }

      if (task.sharedWith.length == undefined) task.sharedWith = [];

      if (task.sharedWith.includes(data.email)) {
        return {
          success: false,
          message: 'Task is already shared with this user.',
        };
      }

      await this.toDoModel.updateOne({ _id: taskId }, { $push: { sharedWith: data.email } });

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

  public async updateTask(data: { taskId: string; updateData: UpdateTaskDto; email: string }) {
    try {
      const taskId_ = new mongoose.Types.ObjectId(data.taskId);
      const taskExists = await this.toDoModel.findOne({ _id: taskId_ });
      if (!taskExists) return { success: false, message: 'Task does not exist' };

      const author = await this.userModel.findOne({ email: data.email });

      if (author.id == taskExists.author) {
        await this.toDoModel.updateOne(
          { _id: taskId_ },
          {
            $set: {
              title: data.updateData?.title,
              completed: data.updateData?.completed,
              description: data.updateData?.description,
              dueDate: data.updateData?.dueDate,
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
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteTask(taskId: string, email: string) {
    try {
      const taskId_ = new mongoose.Types.ObjectId(taskId);

      const taskExists = await this.toDoModel.findOne({ _id: taskId_ });
      if (!taskExists) return { success: false, message: 'Task does not exist' };

      const author = await this.userModel.findOne({ email });

      if (author.id == taskExists.author) {
        await this.toDoModel.deleteOne({ _id: taskId_ });
        return {
          success: true,
          message: 'Task delete successfull.',
        };
      }
      return {
        success: false,
        message: 'Task delete failed.',
      };
    } catch (error) {
      console.log(error);
    }
  }
}
