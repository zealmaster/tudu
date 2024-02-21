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
  ) { }

  public async createGroup(owner: string, data: CreateGroupDto) {
    const userId = new mongoose.Types.ObjectId(owner)
    const user = await this.userModel.findOne({ _id: owner });
    if (!user) return { success: false, message: 'Register to create a group.' };
    console.log(user.username)
    const newGroup = {
      name: data.name,
      owner: user.id,
    };

    const addGroup = await this.groupModel.create(newGroup);
    await addGroup.save();

    return { success: true, message: 'Group created successfully.' };
  }

  public async getGroupByOwner(id: string) {
    const ownerId = new mongoose.Types.ObjectId(id);
    const groups = await this.groupModel.find({ owner: ownerId });
    return {
      success: true,
      groups
    }
  }

  public async addUser(id: string, groupId: string, email: string) {
    const ownerId = new mongoose.Types.ObjectId(id);
    const owner = await this.userModel.findOne({ _id: ownerId });
    const groupIdObj = new mongoose.Types.ObjectId(groupId);
    const groupExists = await this.groupModel.findOne({ _id: groupIdObj });
    const userExists = await this.userModel.findOne({ email });

    if (!groupExists) return { success: false, message: 'Group not found.' };

    if (!userExists) return { success: false, message: 'User not found.' };

    if (groupExists.owner == owner.id) {

      for (let data of groupExists?.users) {
        if (data.email == email) {
          return { success: false, message: 'User already added' };
        }

      }

      await this.groupModel.updateOne({ _id: groupExists.id }, { $push: { users: userExists } });
      return {
        success: true,
        message: 'User added successfully.'
      }
    }
  }

  public async removeUserFromGroup(id: string, groupId: string, email: string) {
    const groupIdObj = new mongoose.Types.ObjectId(groupId);
    const ownerId = new mongoose.Types.ObjectId(id);
    const groupExists = await this.groupModel.findOne({ _id: groupIdObj });

    if (groupExists.owner.toString() !== ownerId.toString()) return {
      success: false,
      message: 'Failed to remove user from the group.'
    }

    for (let i = groupExists.users.length - 1; i >= 0; i--) {
      if (groupExists.users[i].email === email) {
        groupExists.users.splice(i, 1)[0];
        await groupExists.save()
      }
    }
    return { success: true, message: 'User removed successfully.' }
  }

  public async getUsersInGroup(owner: string, groupId: string) {
    const ownerId = new mongoose.Types.ObjectId(owner);
    const groupIdObj = new mongoose.Types.ObjectId(groupId);

    const group = await this.groupModel.findOne({ _id: groupIdObj, owner: ownerId });

    if (group) {
      return {
        success: true,
        name: group.name,
        users: group.users
      }
    }
  }

  public async addTaskToGroup(userId: string, groupId: string, taskId: string) {
    const taskIdObj = new mongoose.Types.ObjectId(taskId);
    const groupIdObj = new mongoose.Types.ObjectId(groupId);

    const task = await this.todoModel.findOne({ _id: taskIdObj });

    const group = await this.groupModel.findOne({ _id: groupIdObj });

    if (task.author.toString() === userId || group.owner.toString() === userId) {
      for (let tasks of group.todos) {
        if ((
          tasks.author.toString() === task.author.toString())
          && tasks.createdAt.toDateString() == task.createdAt.toDateString()
          && tasks.title === task.title) {
          return { success: false, message: 'Task already added.' }
        }
      }
      await this.groupModel.updateOne({ _id: groupIdObj }, { $push: { todos: task } });

      return { success: true, message: 'Task added successfully.' }
    } else {
      return { success: false, message: 'Failed to add task.' }
    }
  }

  public async getTasksInGroup(owner: string, groupId: string) {
    const ownerId = new mongoose.Types.ObjectId(owner);
    const groupIdObj = new mongoose.Types.ObjectId(groupId);
    const user = await this.userModel.findOne({ _id: owner });
    let todos = {}
    const byGroupOwner = await this.groupModel.findOne({ _id: groupIdObj, owner: ownerId });

    if (byGroupOwner == undefined) {
      const group = await this.groupModel.findOne({ _id: groupIdObj });
      if (group == undefined) return { success: false, message: 'Group not found' };
      for (let users of group.users) {
        if (users.email == user.email) {
          const member = await this.groupModel.findOne({ users: user });
          todos = member.todos
          return {
            success: true,
            name: group.name,
            todos: { ...todos }
          }
        }
      }
      if (group) {
        return {
          success: true,
          name: group.name,
          todos: { ...group.todos }
        }
      }
    }
  }

  public async removeTaskFromGroup(userId: string, groupId: string, taskId: string) {
    const groupIdObj = new mongoose.Types.ObjectId(groupId);
    const ownerId = new mongoose.Types.ObjectId(userId);
    const groupExists = await this.groupModel.findOne({ _id: groupId });
    const task = await this.todoModel.findOne({ _id: taskId })

    if (groupExists.owner.toString() !== ownerId.toString()) return {
      success: false,
      message: 'Failed to remove task from the group.'
    }

    for (let i = groupExists.todos.length - 1; i >= 0; i--) {
      let tasks = groupExists.todos[i];
      if (tasks.title === task.title && tasks.author.email == task.author.email && tasks.createdAt.toDateString() == task.createdAt.toDateString()) {
        groupExists.todos.splice(i, 1);
      }
    }

    await groupExists.save()
    return { success: true, message: 'Task removed successfully.' }
  }

  public async getGroupById(userId: string, groupId: string) {
    try {
      const  ownerId = new mongoose.Types.ObjectId(userId);
      const groupIdObj = new mongoose.Types.ObjectId(groupId);
      const groupExists = await this.groupModel.findOne({ _id: groupIdObj, owner: ownerId });
      return {
        success: true, 
        group: groupExists
      }
  
    } catch (error) {
      return {success: false, message: error};
    }
  }

  public async editGroupName(name: string, userId: string, groupId: string) {
    try {
      const ownerId = new mongoose.Types.ObjectId(userId);
      const groupIdObj = new mongoose.Types.ObjectId(groupId);
  
      const group = await this.groupModel.findOne({ _id: groupIdObj, owner: ownerId });
  
      if (!group) return {success: false, message: 'Group not found.'};
        group.name = name;
        await group.save();
        return {success: true, message: 'Group name edited successfully.'}
  
    } catch (error) {
      return {success: false, message: error};
    }
  }
  public async deleteGroup(userId: string, groupId: string) {
    try {
      const ownerId = new mongoose.Types.ObjectId(userId);
      const groupIdObj = new mongoose.Types.ObjectId(groupId);
  
      const group = await this.groupModel.findOne({ _id: groupIdObj, owner: ownerId });
  
      if (!group) return {success: false, message: 'Group not found.'};

        await this.groupModel.deleteOne({ _id: groupIdObj});
        return {success: true, message: 'Group deleted successfully.'}
  
    } catch (error) {
      return {success: false, message: error};
    }
  }
}
