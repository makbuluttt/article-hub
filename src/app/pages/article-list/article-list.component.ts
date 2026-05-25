import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Article } from '../../models/article.model';
import { Category } from '../../models/category.enum';
import { ArticleCardComponent } from './article-card/article-card.component';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ArticleCardComponent,
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss',
})
export class ArticleListComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  categories = ['All', ...Object.values(Category)];
  selectedCategory = 'All';
  searchQuery = '';
  loading = true;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters();
      });
  }

  loadArticles(): void {
    this.loading = true;
    const category =
      this.selectedCategory === 'All' ? undefined : this.selectedCategory;
    this.articleService.getAll(category).subscribe({
      next: (data) => {
        this.articles = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.loadArticles();
  }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredArticles = this.articles.filter((article) =>
      article.title.toLowerCase().includes(query)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
