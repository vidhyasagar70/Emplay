import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Prompt } from '../../../core/models';

@Component({
  selector: 'app-prompt-card',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  template: `
    <a
      [routerLink]="['/prompts', prompt.id]"
      class="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
    >
      <h2 class="text-lg font-semibold text-slate-900">{{ prompt.title }}</h2>
      <div class="mt-2 flex items-center justify-between text-sm text-slate-600">
        <span>Complexity: {{ prompt.complexity }}/10</span>
        <span>{{ prompt.created_at | date: 'mediumDate' }}</span>
      </div>
      @if (prompt.tags.length > 0) {
        <div class="mt-3 flex flex-wrap gap-2">
          @for (tag of prompt.tags; track tag) {
            <span class="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">#{{ tag }}</span>
          }
        </div>
      }
    </a>
  `
})
export class PromptCardComponent {
  @Input({ required: true }) prompt!: Prompt;
}
