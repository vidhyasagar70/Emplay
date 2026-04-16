import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PromptApiService } from '../../core/prompt-api.service';
import { Prompt, Tag } from '../../core/models';
import { PromptCardComponent } from '../../shared/components/prompt-card/prompt-card.component';

@Component({
  selector: 'app-prompt-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, PromptCardComponent],
  template: `
    <section class="mx-auto max-w-5xl px-4 py-8">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">Prompt Library</h1>
          <p class="text-slate-600">Browse AI image generation prompts.</p>
        </div>
        <a routerLink="/add" class="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
          Add Prompt
        </a>
      </div>

      <div class="mb-6 rounded-xl border border-slate-200 bg-white p-4">
        <label for="tagFilter" class="mb-2 block text-sm font-medium text-slate-700">Filter by tag</label>
        <div class="flex gap-2">
          <select
            id="tagFilter"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            [value]="selectedTag()"
            (change)="onTagSelect($event)"
          >
            <option value="">All tags</option>
            @for (tag of tags(); track tag.id) {
              <option [value]="tag.name">{{ tag.name }}</option>
            }
          </select>
          <button type="button" class="rounded-md border border-slate-300 px-3 py-2 text-sm" (click)="clearTag()">Clear</button>
        </div>
      </div>

      @if (loading()) {
        <p class="text-slate-600">Loading prompts...</p>
      } @else if (errorMessage()) {
        <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {{ errorMessage() }}
        </div>
      } @else if (prompts().length === 0) {
        <div class="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
          No prompts found.
        </div>
      } @else {
        <div class="grid gap-4 md:grid-cols-2">
          @for (prompt of prompts(); track prompt.id) {
            <app-prompt-card [prompt]="prompt"></app-prompt-card>
          }
        </div>
      }
    </section>
  `
})
export class PromptListPage {
  private readonly api = inject(PromptApiService);

  protected readonly prompts = signal<Prompt[]>([]);
  protected readonly tags = signal<Tag[]>([]);
  protected readonly loading = signal(true);
  protected readonly selectedTag = signal('');
  protected readonly errorMessage = signal('');

  constructor() {
    this.loadPrompts();
    this.api.getTags().subscribe({
      next: (tags) => this.tags.set(tags),
      error: () => this.tags.set([])
    });
  }

  protected onTagSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    if (value === this.selectedTag()) {
      return;
    }

    this.selectedTag.set(value);
    this.loadPrompts(value || undefined);
  }

  protected clearTag(): void {
    this.selectedTag.set('');
    this.loadPrompts();
  }

  private loadPrompts(tag?: string): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.api.getPrompts(tag).subscribe({
      next: (prompts) => {
        this.prompts.set(prompts);
        this.loading.set(false);
      },
      error: (error) => {
        this.prompts.set([]);
        this.errorMessage.set(error?.error?.error || 'Could not load prompts. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
