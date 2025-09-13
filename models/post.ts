// models/Post.ts
import mongoose, { Schema, Document, models, model } from 'mongoose';

interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;

  images?: string[];
  tags?: string[];
  comments: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  visibility: 'private' | 'friends' | 'public';
  createdAt: Date;
  updatedAt: Date;

  
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

    images: [{ type: String }], 
    tags: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    visibility: { type: String, enum: ['private', 'friends', 'public']},
  },
  
  { timestamps: true }
);

// Prevent model overwrite issue in dev
const Post = models.Post || model<IPost>('Post', PostSchema);
export default Post;
export type { IPost };
