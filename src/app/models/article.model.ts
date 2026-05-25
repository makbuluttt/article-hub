import { Category } from './category.enum';

export interface Article {
  id?: number;
  title: string;
  content: string;
  category?: Category;
  publishedDate: string;
}
