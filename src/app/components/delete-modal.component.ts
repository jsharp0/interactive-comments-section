import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  template: `<div class="delete-modal">
    <h1>Delete comment</h1>
    <p>
      Are you sure you want to delete this comment? This will remove the comment
      and can’t be undone.
    </p>
    <button (click)="cancel.emit(true)">No, Cancel</button>
    <button class="danger" (click)="delete.emit(true)">Yes, Delete</button>
  </div> `,
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
export class DeleteModalComponent {
  @Output() delete = new EventEmitter(false);
  @Output() cancel = new EventEmitter(false);
}
