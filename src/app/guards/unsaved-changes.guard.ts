import { CanDeactivateFn } from '@angular/router';
import { ArticleFormComponent } from '../pages/article-form/article-form.component';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

export const unsavedChangesGuard: CanDeactivateFn<ArticleFormComponent> = (
  component: ArticleFormComponent
): Observable<boolean> | boolean => {
  if (component.form?.dirty) {
    const dialog = inject(MatDialog);
    const dialogRef = dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
    });
    return dialogRef.afterClosed();
  }
  return true;
};

/* export const unsavedChangesGuard: CanDeactivateFn<ArticleFormComponent> = (
  component: ArticleFormComponent
): boolean => {
  if (component.form?.dirty) {
    return window.confirm(
      'You have unsaved changes. Are you sure you want to leave?'
    );
  }
  return true;
}; */
