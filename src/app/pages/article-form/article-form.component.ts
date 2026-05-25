import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { QuillModule } from 'ngx-quill';
import { ArticleService } from '../../services/article.service';
import { Category } from '../../models/category.enum';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    QuillModule,
  ],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss',
})
export class ArticleFormComponent implements OnInit {
  form!: FormGroup;
  categories = Object.values(Category);
  submitting = false;
  isEditMode = false;
  articleId!: number;

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link'],
      ['clean'],
    ],
  };

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initiliazeForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.articleId = Number(id);
      this.loadArticle(this.articleId);
    }
  }

  initiliazeForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(101)]],
      content: ['', Validators.required],
      category: [null],
    });
  }

  loadArticle(id: number) {
    this.articleService.getById(id).subscribe({
      next: (article) => {
        this.form.patchValue({
          title: article.title,
          content: article.content,
          category: article.category || null,
        });
      },
      error: () => {
        this.router.navigate(['/']);
      },
    });
  }

  get titleLength(): number {
    return this.form.get('title')?.value?.length || 0;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting = true;
    this.form.markAsPristine();

    const cleanTitle = DOMPurify.sanitize(this.form.value.title, {
      ALLOWED_TAGS: [],
    });

    const cleanContent = DOMPurify.sanitize(this.form.value.content, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'b',
        'i',
        'u',
        's',
        'strong',
        'em',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'blockquote',
        'code',
        'pre',
        'a',
        'span',
        'div',
      ],
      ALLOWED_ATTR: ['href', 'target', 'class', 'rel'],
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
    });

    const article = {
      title: cleanTitle,
      content: cleanContent,
      category: this.form.value.category || null,
      publishedDate: new Date().toISOString(),
    };

    if (this.isEditMode) {
      this.articleService.update(this.articleId, article).subscribe({
        next: () => {
          this.router.navigate(['/article', this.articleId]);
        },
        error: () => {
          this.submitting = false;
          this.form.markAsDirty();
        },
      });
    } else {
      this.articleService.create(article).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          this.submitting = false;
          this.form.markAsDirty();
        },
      });
    }
  }

  onCancel(): void {
    if (this.isEditMode) {
      this.router.navigate(['/article', this.articleId]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
