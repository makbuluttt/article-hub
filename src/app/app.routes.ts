import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/article-list/article-list.component').then(
        (m) => m.ArticleListComponent
      ),
  },
  {
    path: 'article/create',
    loadComponent: () =>
      import('./pages/article-form/article-form.component').then(
        (m) => m.ArticleFormComponent
      ),
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'article/:id',
    loadComponent: () =>
      import('./pages/article-detail/article-detail.component').then(
        (m) => m.ArticleDetailComponent
      ),
  },
  {
    path: 'comments',
    outlet: 'side-panel',
    loadComponent: () =>
      import('./shared/comment-list/comment-list.component').then(
        (m) => m.CommentListComponent
      ),
  },
];
