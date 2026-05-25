import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    // DOMPurify strips malicious HTML like <script> tags
    const clean = DOMPurify.sanitize(value, {
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

    return this.sanitizer.bypassSecurityTrustHtml(clean);
  }
}
