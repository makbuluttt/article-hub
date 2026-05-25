import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isSidePanelOpen = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const isSidePanelOpen = event.url.includes('side-panel');
        const isArticleDetail = event.url.includes('/articles/');

        if (this.isSidePanelOpen && !isArticleDetail) {
          this.forceCloseSidePanel();
          return;
        }

        this.isSidePanelOpen = isSidePanelOpen;
      }
    });
  }

  closeSidePanel(): void {
    const url = this.router.url;
    const match = url.match(/\/articles\/(\d+)/);
    if (match) {
      this.router.navigate([
        { outlets: { primary: ['articles', match[1]], 'side-panel': null } },
      ]);
    }
  }

  forceCloseSidePanel(): void {
    this.isSidePanelOpen = false;
    this.router.navigate([{ outlets: { 'side-panel': null } }], {
      replaceUrl: true,
    });
  }
}
