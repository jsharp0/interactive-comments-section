import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseData } from '../interfaces/response-data.interface';
import { map, of, tap } from 'rxjs';
import { Comments } from '../interfaces/comment.interface';
import { User } from '../interfaces/user.interface';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  url = 'assets/data.json';
  comments: Comments[] = [];
  constructor(private readonly http: HttpClient) {}

  getComments() {
    const localComments = localStorage.getItem('comments');

    if (!localComments) {
      return this.http.get<ResponseData>(this.url).pipe(
        map((res) => res.comments),
        tap((comments) => this.saveComments(comments)),
        map((comments) => comments.map((c) => this.formatDates(c)))
      );
    } else {
      this.comments = JSON.parse(localComments);
      return of(this.comments.map((c) => this.formatDates(c)));
    }
  }

  addComment(content: string, user: User, parentComment: Comments) {
    const newComment = {
      id: Math.floor(Math.random() * 10000),
      content,
      createdAt: new Date(),
      friendlyCreatedAt: '',
      score: 0,
      user,
      replyingTo: parentComment.user.username,
      replies: [],
    };

    parentComment.replies.push(newComment);

    this.saveComments(this.comments);
  }

  findComment(comment: Comments) {
    let child;
    const parent = this.comments.findIndex((c) => {
      const replyIndex = c.replies.findIndex((x) => x.id === comment.id);
      if (replyIndex !== -1) {
        child = replyIndex;
        return true;
      }
      return c.id === comment.id;
    });

    return { parent, child };
  }

  editComment(comment: Comments) {
    const commentIndex = this.findComment(comment);

    if (commentIndex.child || commentIndex.child === 0) {
      this.comments[commentIndex.parent].replies[commentIndex.child] = comment;
    } else {
      this.comments[commentIndex.parent] = comment;
    }

    this.saveComments(this.comments);
  }

  deleteComment(comment: Comments) {
    const commentIndex = this.findComment(comment);

    if (commentIndex.child || commentIndex.child === 0) {
      this.comments[commentIndex.parent].replies.splice(commentIndex.child, 1);
    } else {
      this.comments.slice(commentIndex.parent, 1);
    }

    this.saveComments(this.comments);
  }

  saveComments(comments: Comments[]) {
    localStorage.setItem('comments', JSON.stringify(comments));
  }

  private formatDates(comment: Comments) {
    const timeAgo = new TimeAgo('en-US');

    return {
      ...comment,
      friendlyCreatedAt: timeAgo.format(new Date(comment.createdAt)),
    };
  }
}
