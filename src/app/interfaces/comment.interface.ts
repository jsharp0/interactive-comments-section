import { User } from './user.interface';

export interface Comments {
  id: number;
  content: string;
  createdAt: Date;
  friendlyCreatedAt: string;
  score: number;
  user: User;
  replyingTo?: string;
  replies: Comments[];
}
