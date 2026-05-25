import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommentService } from '../../services/comment.service';
import { EventService } from '../../services/event.service';
import { ArticleComment } from '../../models/article-comment.model';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss',
})
export class CommentFormComponent {
  @Input() articleId!: number;
  @Output() commentAdded = new EventEmitter<void>();

  form: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private eventService: EventService
  ) {
    this.form = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting = true;

    const cleanContent = DOMPurify.sanitize(this.form.value.content, {
      ALLOWED_TAGS: [],
    });

    const comment: ArticleComment = {
      articleId: this.articleId,
      content: cleanContent,
      createdAt: new Date().toISOString(),
    };

    this.commentService.create(comment).subscribe({
      next: () => {
        this.form.reset();
        this.submitting = false;
        this.commentAdded.emit();
        this.eventService.notifyCommentAdded();
      },
      error: () => {
        this.submitting = false;
      },
    });
  }
}
