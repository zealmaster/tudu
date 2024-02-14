import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({
    name: 'username',
    unique: true,
    required: true,
  })
  username: string;

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    name: 'password',
    required: true,
  })
  password: string;

  @Prop({
    name: 'first_name',
    type: 'string',
    length: 100,
  })
  firstName: string;

  @Prop({
    name: 'last_name',
    type: 'string',
    length: 100,
  })
  lastName: string;

  @Prop({
    name: 'created_at',
    type: 'date',
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    name: 'updated_at',
    type: 'date',
    default: Date.now,
  })
  updatedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
