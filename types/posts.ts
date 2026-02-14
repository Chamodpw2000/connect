import { postFormType } from "@/lib/validations/post";
import { IComment } from "@/models/comment";
import { IUser } from "@/models/user";
import { UserApiResponseType } from "./user";






export interface PostFormProps {

    addPost: ({ data }: { data: postFormType }) => Promise<any>;
    
}
export interface PostForPostCardType {
    _id: string;
    title: string;
    content: string;
    author: IUser | null; // Allow null in case author is not found
    createdAt: string | Date;
    updatedAt: string | Date;
    images?: string[];
}

export interface PostCardProps {
    post: PostForPostCardType;
    onLike?: (postId: string) => void;
    onComment?: (postId: string) => void;
    onShare?: (postId: string) => void;
    onEdit?: (postId: string) => void;
    onDelete?: (postId: string) => void;
    currentUserEmail?: string;
    className?: string;
}

export interface PostApiResponseType   {

_id: string;
title: string;
  content: string;
  author: (IUser & { _id: string }) | null; // Allow null for deleted users

  images?: string[];
  tags?: string[];
  comments: (IComment & { _id: string })[];
  likes: (IUser & { _id: string })[];
  visibility: 'private' | 'friends' | 'public';
  createdAt: Date;
  updatedAt: Date;


}

export interface NewFeedProps {
    user: UserApiResponseType | null;
}


