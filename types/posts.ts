interface IAuthor {
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  role: string;
}
export interface IPost {
  _id: string;
  title: string;
  content: string;
  author: IAuthor;
  createdAt: string | Date;
  updatedAt: string | Date;
  images?: string[];
}

export interface PostsProps {
  posts: IPost[];
}

export interface ImagePreview {
    file: File;
    url: string;
    id: string;
}
