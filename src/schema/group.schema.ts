import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { ToDo } from "./todo.schema";
import mongoose from "mongoose";

@Schema()
export class Group {
    @Prop()
    name: string;

    @Prop()
    users: [User];

    @Prop()
    todos: [ToDo];

    @Prop({
        ref: () => User
    })
    owner: User;
}
export const GroupSchema = SchemaFactory.createForClass(Group)