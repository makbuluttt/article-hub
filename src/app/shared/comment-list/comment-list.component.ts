import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { ArticleComment } from '../../models/article-comment.model';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CommentFormComponent,
  ],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss',
})
export class CommentListComponent implements OnInit {
  comments: ArticleComment[] = [];
  articleId!: number;
  loading = true;

  constructor(
    private commentService: CommentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.getArticleIdFromUrl();
    });
    this.getArticleIdFromUrl();
  }

  getArticleIdFromUrl(): void {
    const url = this.router.url;
    const match = url.match(/\/article\/(\d+)/);
    if (match) {
      const id = Number(match[1]);
      if (id !== this.articleId) {
        this.articleId = id;
        this.loadComments();
      }
    }
  }

  loadComments(): void {
    this.loading = true;
    this.commentService.getByArticleId(this.articleId).subscribe({
      next: (data) => {
        this.comments = data;
        this.loading = false;
      },
    });
  }

  onCommentAdded(): void {
    this.loadComments();
  }

  close(): void {
    this.router.navigate([
      {
        outlets: { primary: ['article', this.articleId], 'side-panel': null },
      },
    ]);
  }

  getLocalDate(utcDate: string): string {
    return new Date(utcDate).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
