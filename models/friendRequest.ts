import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IFriendRequest extends Document {
  requester: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';

}

const FriendRequestSchema = new Schema<IFriendRequest>({
  requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, {
  timestamps: true,
});

const FriendRequest = models.FriendRequest || model<IFriendRequest>('FriendRequest', FriendRequestSchema);
export default FriendRequest;
