import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  isEdited: boolean;

}

const CommentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  isEdited: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Comment = models.Comment || model<IComment>('Comment', CommentSchema);
export default Comment;
