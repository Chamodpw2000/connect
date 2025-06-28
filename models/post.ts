// models/Post.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

interface IPost extends Document {
  title: string;
  content: string;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent model overwrite issue in dev
const Post = models.Post || model<IPost>('Post', PostSchema);
export default Post;
