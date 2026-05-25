import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArticleComment } from '../models/article-comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl =
    'https://my-json-server.typicode.com/makbuluttt/article-hub/comments';

  constructor(private http: HttpClient) {}

  getByArticleId(articleId: number): Observable<ArticleComment[]> {
    const params = new HttpParams().set('articleId', articleId);
    return this.http.get<ArticleComment[]>(this.apiUrl, { params });
  }

  create(comment: ArticleComment): Observable<ArticleComment> {
    return this.http.post<ArticleComment>(this.apiUrl, comment);
  }
}
