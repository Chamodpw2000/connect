// Import all models to ensure they're registered with Mongoose
import User from './user';
import Post from './post';
import Comment from './comment';
import FriendRequest from './friendRequest';

export {
  User,
  Post,
  Comment,
  FriendRequest
};

// This ensures all models are registered when this file is imported