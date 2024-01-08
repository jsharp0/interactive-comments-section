import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Comments } from '../interfaces/comment.interface';

@Component({
  selector: 'app-add-comment',
  template: `
    <div class="add-comment" *ngIf="currentUser | async as currentUser">
      <img class="desktop" [src]="'.' + currentUser.image.png" />
      <textarea
        placeholder="Add a comment..."
        [(ngModel)]="commentContent"
      ></textarea>
      <div class="add-comment-bottom-bar">
        <img class="mobile" [src]="'.' + currentUser.image.png" />
        <button
          class="primary"
          (click)="
            addComment.emit({ user: currentUser, content: commentContent })
          "
        >
          {{ isEdit ? 'UPDATE' : 'SEND' }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .delete-modal {
        background-color: white;
        border-radius: 0.5rem;
        margin-top: 1rem;

        button {
          margin-right: 0.85rem;
        }
      }
    `,
  ],
})
export class AddCommentComponent {
  @Input() isEdit = false;
  @Input() currentUser: Observable<User> | undefined;
  @Input() commentContent = '';

  @Output() addComment = new EventEmitter<{ user: User; content: string }>();
}
