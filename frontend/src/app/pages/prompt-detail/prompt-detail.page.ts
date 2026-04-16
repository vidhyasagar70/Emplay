import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PromptApiService } from '../../core/prompt-api.service';
import { Prompt } from '../../core/models';

@Component({
  selector: 'app-prompt-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <section class="mx-auto max-w-4xl px-4 py-8">
      <a routerLink="/" class="mb-6 inline-block text-sm font-medium text-slate-700 hover:text-slate-900">← Back to prompts</a>

      @if (loading()) {
        <p class="text-slate-600">Loading prompt details...</p>
      } @else if (errorMessage()) {
        <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {{ errorMessage() }}
        </div>
      } @else if (!prompt()) {
        <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          Prompt not found.
        </div>
      } @else {
        <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">{{ prompt()!.title }}</h1>
          <div class="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
            <span>Complexity: {{ prompt()!.complexity }}/10</span>
            <span>Created: {{ prompt()!.created_at | date: 'medium' }}</span>
            <span class="font-semibold text-emerald-700">Views: {{ viewCount() }}</span>
          </div>

          @if (prompt()!.tags.length > 0) {
            <div class="mt-4 flex flex-wrap gap-2">
              @for (tag of prompt()!.tags; track tag) {
                <span class="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">#{{ tag }}</span>
              }
            </div>
          }

          <p class="mt-6 whitespace-pre-line text-base leading-7 text-slate-800">{{ prompt()!.content }}</p>
        </article>
      }
    </section>
  `
})
export class PromptDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(PromptApiService);

  protected readonly prompt = signal<Prompt | null>(null);
  protected readonly loading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly viewCount = computed(() => this.prompt()?.view_count ?? 0);
  private lastLoadedPromptId = '';

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.loading.set(false);
        return;
      }

      if (id === this.lastLoadedPromptId) {
        return;
      }

      this.lastLoadedPromptId = id;

      this.loading.set(true);
      this.errorMessage.set('');
      this.api.getPromptById(id).subscribe({
        next: (prompt) => {
          this.prompt.set(prompt);
          this.loading.set(false);
        },
        error: (error) => {
          this.prompt.set(null);
          this.errorMessage.set(error?.error?.error || 'Could not load this prompt.');
          this.loading.set(false);
        }
      });
    });
  }
}
