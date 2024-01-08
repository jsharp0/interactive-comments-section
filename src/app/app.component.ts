import { Component } from '@angular/core';
import { CommentService } from './services/comment.service';
import { UserService } from './services/user.service';
import { Comments } from './interfaces/comment.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  deleteModalOpen = false;
  comments = this.commentService.getComments();
  currentUser = this.userService.getCurrentUser();
  selectedComment: Comments | undefined;

  constructor(
    private commentService: CommentService,
    private userService: UserService
  ) {}

  confirmDelete(comment: Comments) {
    this.deleteModalOpen = true;
    this.selectedComment = comment;
  }

  deleteComment() {
    if (this.selectedComment) {
      this.commentService.deleteComment(this.selectedComment);
    }
    this.deleteModalOpen = false;
  }
}
