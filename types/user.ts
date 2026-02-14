import mongoose from 'mongoose';

export interface UserApiResponseType {
    _id: string;

        firstName: string;
        lastName?: string;
        email: string;
        password?: string;
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