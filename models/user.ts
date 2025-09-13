// models/User.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
    firstName: string;
    lastName?: string;
    email: string;
    password?: string; // hashed
    role: string;
    birthdate?: Date;
    country?: string;
    bio?: string;
    image?: string;
    miniDescription?: string;
    friends?: mongoose.Types.ObjectId[];
    emailVerified?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    birthdate: { type: Date },
    country: { type: String },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    miniDescription: { type: String, default: '' },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' , default: []}],
    emailVerified: { type: Boolean, default: false },

 }, {
    timestamps: true,

});

const User = models.User || model<IUser>('User', UserSchema);
export default User;
