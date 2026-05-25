# ArticleHub

A modern article publishing platform built with Angular 18. Users can create and publish articles using a rich text editor, browse and filter articles by category, and engage through a sliding comments panel.

---

## Live Demo

🌐 **[https://makbuluttt.github.io/article-hub/](https://makbuluttt.github.io/article-hub/)**

---

## Tech Stack

| Technology       | Version | Purpose              |
| ---------------- | ------- | -------------------- |
| Angular          | 18.2.x  | Frontend framework   |
| Angular Material | 18.2.x  | UI component library |
| ngx-quill        | 26.x    | Rich text editor     |
| JSON Server      | latest  | Mock REST API        |
| DOMPurify        | latest  | XSS protection       |
| RxJS             | 7.x     | Reactive programming |
| TypeScript       | 5.x     | Type safety          |
| SCSS             | -       | Styling              |

---

## Features

### Article Management

- Create articles with a rich text editor (Quill)
- Title limited to 101 characters with live counter
- Optional category selection from predefined enum
- Auto-generated ISO 8601 publish date on submission
- Unsaved changes protection with Material dialog

### Article List

- Responsive grid layout
- Search articles by title with 300ms debounce
- Filter articles by category
- Truncated excerpt (150 chars, HTML stripped)
- Publish date converted from UTC to local browser timezone
- Empty state when no articles available

### Article Detail

- Full article content rendered safely
- Category chip aligned with title
- Comments count button

### Comments Panel

- Auxiliary route navigation `/articles/:id(side-panel:comments)`
- Slides in from the right with CSS animation
- Backdrop click to close
- Auto closes when navigating away
- Live comment count updates after posting
- Plain text only (HTML stripped for security)

### Security

- Article content sanitized with DOMPurify
- Article titles stripped of all HTML
- Comments stripped of all HTML (plain text only)
- Angular's DomSanitizer used for safe HTML rendering
- XSS protection on all user inputs

---

## Project Structure

```
src/app/
├── guards/
│   └── unsaved-changes.guard.ts    → CanDeactivate guard
│
├── models/
│   ├── article.model.ts            → Article interface
│   ├── article-comment.model.ts    → ArticleComment interface
│   └── category.enum.ts           → Category enum
│
├── pages/
│   ├── article-list/               → Browse & filter articles
│   │   └── article-card/           → Reusable article card
│   ├── article-detail/             → Read full article
│   └── article-form/               → Create new article
│
├── services/
│   ├── article.service.ts          → Article HTTP calls
│   ├── comment.service.ts          → Comment HTTP calls
│   └── event.service.ts            → Cross-component events
│
└── shared/
    ├── comment-list/               → Comments panel list
    ├── comment-form/               → Add new comment form
    ├── confirm-dialog/             → Unsaved changes dialog
    ├── navbar/                     → Top navigation bar
    └── pipes/
        └── safe-html.pipe.ts       → DOMPurify sanitization pipe
```

---

## API Endpoints

Base URL: `https://my-json-server.typicode.com/makbuluttt/article-hub`

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| GET    | `/articles`               | List all articles        |
| GET    | `/articles?category=Dogs` | Filter by category       |
| GET    | `/articles/:id`           | Get single article       |
| POST   | `/articles`               | Create new article       |
| PUT    | `/articles/:id`           | Update article           |
| DELETE | `/articles/:id`           | Delete article           |
| GET    | `/comments?articleId=1`   | Get comments for article |
| POST   | `/comments`               | Add new comment          |

---

## Data Models

### Article

```typescript
interface Article {
  id?: number;
  title: string; // max 101 characters
  content: string; // rich text HTML
  category?: Category; // optional enum value
  publishedDate: string; // ISO 8601 format
}
```

### ArticleComment

```typescript
interface ArticleComment {
  id?: number;
  articleId: number;
  content: string; // plain text only
  createdAt: string; // ISO 8601 format
}
```

### Category Enum

```typescript
enum Category {
  Cats = "Cats",
  Dogs = "Dogs",
  Not_Funny = "Not Funny",
}
```

---

## Getting Started

### Prerequisites

- Node.js 20.x
- npm 10.x
- Angular CLI 18.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd article-project

# Install dependencies
npm install

# Install Angular CLI globally
npm install -g @angular/cli@18

# Install JSON Server globally
npm install -g json-server
```

## Running the App

### Local Development

You need two terminals:

**Terminal 1 — Start the mock API:**

```bash
json-server --watch db.json --port 3000
```

**Terminal 2 — Start the Angular app:**

```bash
ng serve --open
```

App runs at: `http://localhost:4200`
API runs at: `http://localhost:3000`

### Production

App is live at: `https://makbuluttt.github.io/article-hub/`
API is live at: `https://my-json-server.typicode.com/makbuluttt/article-hub`

⚠️ Demo mode — data modifications are disabled
my-json-server → GET only

---

## Angular Material Theme

Using the `azure-blue` prebuilt theme from Angular Material.

---

## Security Considerations

All user inputs are sanitized before saving and before rendering:

| Input            | Sanitization                                          |
| ---------------- | ----------------------------------------------------- |
| Article title    | All HTML stripped — plain text only                   |
| Article content  | Safe Quill HTML tags only — scripts/iframes forbidden |
| Comments         | All HTML stripped — plain text only                   |
| Rendered content | DOMPurify + Angular DomSanitizer                      |

Forbidden tags: `script`, `iframe`, `object`, `embed`, `form`
Forbidden attributes: `onerror`, `onload`, `onclick`, `onmouseover`, `style`

---

## Routing

| Route                               | Component              | Description         |
| ----------------------------------- | ---------------------- | ------------------- |
| `/`                                 | ArticleListComponent   | Browse all articles |
| `/article/create`                   | ArticleFormComponent   | Create new article  |
| `/article/:id/edit`                 | ArticleFormComponent   | Edit article        |
| `/article/:id`                      | ArticleDetailComponent | Read article        |
| `/article/:id(side-panel:comments)` | CommentListComponent   | Comments panel      |

---

## Available Scripts

```bash
# Start development server
ng serve

# Build for production
ng build
```
