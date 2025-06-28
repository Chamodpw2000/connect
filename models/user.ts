// models/User.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IUser extends Document {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string; // hashed
    role: string;
    birthdate: Date;
    country: string;
    bio: string;
    image: string;
}

const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    birthdate: { type: Date, required: true },
    country: { type: String, required: true },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
}, {
    timestamps: true,

});

const User = models.User || model<IUser>('User', UserSchema);
export default User;
