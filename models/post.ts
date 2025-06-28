// models/Post.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

interface IAuthor {
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  role: string;
}

interface IPost extends Document {
  title: string;
  content: string;
  author: IAuthor;
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      email: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, },
      image: { type: String, required: true },
      role: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    images: [{ type: String }], 
  },
  { timestamps: true }
);

// Prevent model overwrite issue in dev
const Post = models.Post || model<IPost>('Post', PostSchema);
export default Post;
