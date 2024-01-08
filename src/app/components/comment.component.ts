import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  faMinus,
  faPencil,
  faPlus,
  faReply,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { Comments } from '../interfaces/comment.interface';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { CommentService } from '../services/comment.service';

@Component({
  selector: 'app-comment',
  template: `<div class="comment" *ngIf="comment && !isEdit">
      <div class="full-width" *ngIf="currentUser | async as currentUser">
        <div class="comment-heading">
          <div class="metadata">
            <img [src]="comment.user.image.png" />
            <span class="username">{{ comment.user.username }}</span>
            <span
              class="badge"
              *ngIf="currentUser.username === comment.user.username"
              >you</span
            >
            <span>{{ comment.friendlyCreatedAt }}</span>
          </div>

          <div
            class="reply desktop"
            *ngIf="currentUser.username !== comment.user.username"
            (click)="replyTo()"
          >
            <fa-icon [icon]="faReply"></fa-icon>
            <span>Reply</span>
          </div>

          <div
            class="btn-container"
            *ngIf="currentUser.username === comment.user.username"
          >
            <div class="delete desktop" (click)="confirmDelete.emit(true)">
              <fa-icon [icon]="faTrashCan"></fa-icon><span>Delete</span>
            </div>
            <div class="edit desktop" (click)="isEdit = true">
              <fa-icon [icon]="faPencil"></fa-icon><span>Edit</span>
            </div>
          </div>
        </div>
        <p>{{ comment.content }}</p>
      </div>
      <div class="bottom-bar" *ngIf="currentUser | async as currentUser">
        <div class="score-control">
          <fa-icon (click)="upvote()" [icon]="faPlus"></fa-icon>
          <span>{{ comment.score }}</span>
          <fa-icon (click)="downvote()" [icon]="faMinus"></fa-icon>
        </div>
        <div
          class="reply mobile"
          (click)="replyTo()"
          *ngIf="currentUser.username !== comment.user.username"
        >
          <fa-icon [icon]="faReply"></fa-icon> <span>Reply</span>
        </div>
        <div
          class="btn-container"
          *ngIf="currentUser.username === comment.user.username"
        >
          <div class="delete mobile" (click)="confirmDelete.emit(true)">
            <fa-icon [icon]="faTrashCan"></fa-icon><span>Delete</span>
          </div>
          <div class="edit mobile">
            <fa-icon [icon]="faPencil"></fa-icon><span>Edit</span>
          </div>
        </div>
      </div>
    </div>
    <app-add-comment
      [currentUser]="currentUser"
      [commentContent]="isEdit ? comment?.content ?? '' : ''"
      (addComment)="addComment($event)"
      [isEdit]="isEdit"
      *ngIf="isReplying || isEdit"
    ></app-add-comment> `,
  styles: [
    `
      .comment {
        background-color: white;
        border-radius: 0.5rem;
      }

      .btn-container {
        display: flex;

        .delete {
          margin-right: 1rem;
        }
      }

      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class CommentComponent {
  @Input() comment: Comments | undefined;
  @Input() currentUser: Observable<User> | undefined;
  @Input() parentComment: Comments | undefined;

  @Output() confirmDelete = new EventEmitter(false);

  faReply = faReply;
  faPlus = faPlus;
  faMinus = faMinus;
  faPencil = faPencil;
  faTrashCan = faTrashCan;

  isReplying = false;
  replyingTo: { id?: number; username?: string } | undefined;
  isEdit = false;

  constructor(private readonly commentService: CommentService) {}

  addComment(comment: { user: User; content: string }) {
    if (this.comment && !this.isEdit) {
      this.commentService.addComment(
        comment.content,
        comment.user,
        this.parentComment ?? this.comment
      );
    } else if (this.isEdit && this.comment) {
      this.commentService.editComment({
        ...this.comment,
        content: comment.content,
      });
    }

    this.isReplying = false;
    this.isEdit = false;
  }

  replyTo() {
    this.isReplying = true;
    this.replyingTo = {
      id: this.comment?.id,
      username: this.comment?.user.username,
    };
  }

  upvote() {
    if (this.comment) {
      this.comment.score = this.comment.score + 1;
      this.commentService.editComment(this.comment);
    }
  }

  downvote() {
    if (this.comment) {
      this.comment.score = this.comment.score - 1;
      this.commentService.editComment(this.comment);
    }
  }
}
