import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose } from 'mongoose';
import { Group } from 'src/schema/group.schema';
import { CreateGroupDto } from './dto/create.dto';
import { User } from 'src/schema/user.schema';
import { ToDo } from 'src/schema/todo.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name)
    private groupModel: Model<Group>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(ToDo.name)
    private todoModel: Model<ToDo>
  ) {}

  public async createGroup(owner: string, data: CreateGroupDto) {
    try {
      const userId = new mongoose.Types.ObjectId(owner);
      const user = await this.userModel.findOne({ _id: owner });
      if (!user) return { success: false, message: 'Register to create a group.' };
      console.log(user.username);
      const newGroup = {
        name: data.name,
        owner: user.id,
      };

      const addGroup = await this.groupModel.create(newGroup);
      await addGroup.save();

      return { success: true, message: 'Group created successfully.' };
    } catch (error) {
      console.error('Create group error: ', error);
    }
  }

  public async getGroupByOwner(userId: string) {
    try {
      const ownerId = new mongoose.Types.ObjectId(userId);
      const groups = await this.groupModel.find({ owner: ownerId });
      return {
        success: true,
        groups,
      };
    } catch (error) {
      console.error(error);
    }
  }

  public async addUserToGroup(data: { userId: string; groupId: string; email: string }) {
    try {
      const ownerId = new mongoose.Types.ObjectId(data.userId);
      const owner = await this.userModel.findOne({ _id: ownerId });
      const groupIdObj = new mongoose.Types.ObjectId(data.groupId);
      const groupExists = await this.groupModel.findOne({ _id: groupIdObj });
      const userExists = await this.userModel.findOne({ email: data.email });

      if (!groupExists) return { success: false, message: 'Group not found.' };

      if (!userExists) return { success: false, message: 'User not found.' };

      if (groupExists.owner == owner.id) {
        for (let data of groupExists?.users) {
          if (data.email == data.email) {
            return { success: false, message: 'User already added' };
          }
        }

        await this.groupModel.updateOne({ _id: groupExists.id }, { $push: { users: userExists } });
        return {
          success: true,
          message: 'User added successfully.',
        };
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async removeUserFromGroup(data: { userId: string; groupId: string; email: string }) {
    try {
      const groupIdObj = new mongoose.Types.ObjectId(data.groupId);
      const ownerId = new mongoose.Types.ObjectId(data.userId);
      const groupExists = await this.groupModel.findOne({ _id: groupIdObj });

      if (groupExists.owner.toString() !== ownerId.toString())
        return {
          success: false,
          message: 'Failed to remove user from the group.',
        };

      for (let i = groupExists.users.length - 1; i >= 0; i--) {
        if (groupExists.users[i].email === data.email) {
          groupExists.users.splice(i, 1)[0];
          await groupExists.save();
        }
      }
      return { success: true, message: 'User removed successfully.' };
    } catch (error) {
      console.error(error);
    }
  }

  public async getUsersInGroup(userId: string, groupId: string) {
    try {
      const ownerId = new mongoose.Types.ObjectId(userId);
      const groupIdObj = new mongoose.Types.ObjectId(groupId);

      const group = await this.groupModel.findOne({ _id: groupIdObj, owner: ownerId });

      if (group) {
        return {
          success: true,
          name: group.name,
          users: group.users,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async addTaskToGroup(data: { userId: string; groupId: string; taskId: string }) {
    try {
      const taskIdObj = new mongoose.Types.ObjectId(data.taskId);
      const groupIdObj = new mongoose.Types.ObjectId(data.groupId);

      const task = await this.todoModel.findOne({ _id: taskIdObj });

      const group = await this.groupModel.findOne({ _id: groupIdObj });

      if (task.author.toString() === data.userId || group.owner.toString() === data.userId) {
        for (let tasks of group.todos) {
          if (
            tasks.author.toString() === task.author.toString() &&
            tasks.createdAt.toDateString() == task.createdAt.toDateString() &&
            tasks.title === task.title
          ) {
            return { success: false, message: 'Task already added.' };
          }
        }
        await this.groupModel.updateOne({ _id: groupIdObj }, { $push: { todos: task } });

        return { success: true, message: 'Task added successfully.' };
      } else {
        return { success: false, message: 'Failed to add task.' };
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getTasksInGroup(data: { userId: string; groupId: string }) {
    try {
      const ownerId = new mongoose.Types.ObjectId(data.userId);
      const groupIdObj = new mongoose.Types.ObjectId(data.groupId);
      const user = await this.userModel.findOne({ _id: data.userId });
      let todos = {};
      const byGroupOwner = await this.groupModel.findOne({ _id: groupIdObj, owner: ownerId });

      if (byGroupOwner == undefined) {
        const group = await this.groupModel.findOne({ _id: groupIdObj });
        if (group == undefined) return { success: false, message: 'Group not found' };
        for (let users of group.users) {
          if (users.email == user.email) {
            const member = await this.groupModel.findOne({ users: user });
            todos = member.todos;
            return {
              success: true,
              name: group.name,
              todos: { ...todos },
            };
          }
        }
        if (group) {
          return {
            success: true,
            name: group.name,
            todos: { ...group.todos },
          };
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async removeTaskFromGroup(data: { userId: string; groupId: string; taskId: string }) {
    try {
      const groupIdObj = new mongoose.Types.ObjectId(data.groupId);
      const ownerId = new mongoose.Types.ObjectId(data.userId);
      const groupExists = await this.groupModel.findOne({ _id: data.groupId });
      const task = await this.todoModel.findOne({ _id: data.taskId });

      if (groupExists.owner.toString() !== ownerId.toString())
        return {
          success: false,
          message: 'Failed to remove task from the group.',
        };

      for (let i = groupExists.todos.length - 1; i >= 0; i--) {
        let tasks = groupExists.todos[i];
        if (
          tasks.title === task.title &&
          tasks.author.email == task.author.email &&
          tasks.createdAt.toDateString() == task.createdAt.toDateString()
        ) {
          groupExists.todos.splice(i, 1);
        }
      }

      await groupExists.save();
      return { success: true, message: 'Task removed successfully.' };
    } catch (error) {
      console.log(error);
    }
  }

  public async getGroupById(data: { userId: string; groupId: string }) {
    try {
      const ownerId = new mongoose.Types.ObjectId(data.userId);
      const groupIdObj = new mongoose.Types.ObjectId(data.groupId);
      const groupExists = await this.groupModel.findOne({ _id: groupIdObj, owner: ownerId });
      return {
        success: true,
        group: groupExists,
      };
    } catch (error) {
      return { success: false, message: error };
    }
  }

  public async editGroupName(data: { groupName: string; userId: string; groupId: string }) {
    try {
      const ownerId = new mongoose.Types.ObjectId(data.userId);
      const groupIdObj = new mongoose.Types.ObjectId(data.groupId);

      const group = await this.groupModel.findOne({ _id: groupIdObj, owner: ownerId });

      if (!group) return { success: false, message: 'Group not found.' };
      group.name = data.groupName;
      await group.save();
      return { success: true, message: 'Group name edited successfully.' };
    } catch (error) {
      return { success: false, message: error };
    }
  }
  public async deleteGroup(data: { userId: string; groupId: string }) {
    try {
      const ownerId = new mongoose.Types.ObjectId(data.userId);
      const groupIdObj = new mongoose.Types.ObjectId(data.groupId);

      const group = await this.groupModel.findOne({ _id: groupIdObj, owner: ownerId });

      if (!group) return { success: false, message: 'Group not found.' };

      await this.groupModel.deleteOne({ _id: groupIdObj });
      return { success: true, message: 'Group deleted successfully.' };
    } catch (error) {
      return { success: false, message: error };
    }
  }
}
