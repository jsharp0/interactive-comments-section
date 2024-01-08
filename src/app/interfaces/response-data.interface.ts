import { Comments } from './comment.interface';
import { User } from './user.interface';

export interface ResponseData {
  currentUser: User;
  comments: Comments[];
}
