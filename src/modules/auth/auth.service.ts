import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ username });
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      return {
        success: false,
        msg: 'Wrong credentials provided',
      };
    } catch (error) {
      console.log('Validation error: ', error);
    }
  }

  public async loginUser(username: string) {
    try {
      const userExists = await this.userModel.findOne({ username });
      if (!userExists) {
        return {
          success: false,
          msg: 'Username does not exist',
        };
      }
      const payload = { email: userExists.email, sub: userExists.id, username: userExists.username };
      const { password: _, ...user } = userExists.toObject();
      return {
        success: true,
        msg: 'Login successful',
        user,
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        msg: 'Problem logging in.',
      };
    }
  }
}
