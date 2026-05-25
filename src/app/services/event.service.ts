import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private commentAdded$ = new Subject<void>();
  commentAdded = this.commentAdded$.asObservable();

  notifyCommentAdded(): void {
    this.commentAdded$.next();
  }
}
