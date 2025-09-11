// models/Post.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
