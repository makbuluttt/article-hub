import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Article } from '../../../models/article.model';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
})
export class ArticleCardComponent {
  @Input() article!: Article;

  getExcerpt(content: string): string {
    const stripped = content
      .replace(/<[^>]*>/g, '') // remove HTML tags
      .replace(/&nbsp;/g, ' ') // replace &nbsp; with space
      .replace(/&amp;/g, '&') // replace &amp; with &
      .replace(/&lt;/g, '<') // replace &lt; with
      .replace(/&gt;/g, '>') // replace &gt; with >
      .replace(/\s+/g, ' ') // collapse multiple spaces
      .trim();
    return stripped.length > 150
      ? stripped.substring(0, 150) + '...'
      : stripped;
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
}
