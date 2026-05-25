import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';
import { ArticleService } from '../../services/article.service';
import { CommentService } from '../../services/comment.service';
import { EventService } from '../../services/event.service';
import { Article } from '../../models/article.model';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    SafeHtmlPipe,
  ],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  article: Article | null = null;
  commentCount = 0;
  loading = true;
  commentsOpen = false;
  articleId!: number;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private commentService: CommentService,
    private eventService: EventService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadArticle(this.articleId);
    this.loadCommentCount(this.articleId);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.commentsOpen = event.url.includes('side-panel');
      }
    });

    this.eventService.commentAdded
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadCommentCount(this.articleId);
      });
  }

  loadArticle(id: number): void {
    this.articleService.getById(id).subscribe({
      next: (data) => {
        this.article = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
    });
  }

  loadCommentCount(id: number): void {
    this.commentService.getByArticleId(id).subscribe({
      next: (comments) => {
        this.commentCount = comments.length;
      },
    });
  }

  editArticle(): void {
    this.router.navigate(['/article', this.articleId, 'edit']);
  }

  deleteArticle(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.articleService.delete(this.articleId).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
        });
      }
    });
  }

  getLocalDate(utcDate: string): string {
    return new Date(utcDate).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  toggleComments(): void {
    if (this.commentsOpen) {
      this.router.navigate([
        {
          outlets: {
            primary: ['article', this.articleId],
            'side-panel': null,
          },
        },
      ]);
    } else {
      this.router.navigate([
        {
          outlets: {
            primary: ['article', this.articleId],
            'side-panel': ['comments'],
          },
        },
      ]);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
