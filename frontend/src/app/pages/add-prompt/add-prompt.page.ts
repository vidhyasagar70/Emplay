import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PromptApiService } from '../../core/prompt-api.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-add-prompt-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-8">
      <a routerLink="/" class="mb-6 inline-block text-sm font-medium text-slate-700 hover:text-slate-900">← Back to prompts</a>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-bold text-slate-900">Add New Prompt</h1>

        @if (errorMessage()) {
          <p class="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{{ errorMessage() }}</p>
        }

        <form class="mt-6 space-y-5" [formGroup]="form" (ngSubmit)="submit()">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700" for="title">Title</label>
            <input id="title" type="text" formControlName="title" class="w-full rounded-md border border-slate-300 px-3 py-2" />
            @if (isInvalid('title')) {
              <p class="mt-1 text-sm text-red-600">Title must be at least 3 characters.</p>
            }
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700" for="content">Content</label>
            <textarea id="content" rows="6" formControlName="content" class="w-full rounded-md border border-slate-300 px-3 py-2"></textarea>
            @if (isInvalid('content')) {
              <p class="mt-1 text-sm text-red-600">Content must be at least 20 characters.</p>
            }
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700" for="complexity">Complexity (1-10)</label>
            <input id="complexity" type="number" min="1" max="10" formControlName="complexity" class="w-full rounded-md border border-slate-300 px-3 py-2" />
            @if (isInvalid('complexity')) {
              <p class="mt-1 text-sm text-red-600">Complexity must be between 1 and 10.</p>
            }
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700" for="tags">Tags (comma separated)</label>
            <input id="tags" type="text" formControlName="tags" class="w-full rounded-md border border-slate-300 px-3 py-2" />
          </div>

          <button
            type="submit"
            class="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            [disabled]="form.invalid || submitting()"
          >
            {{ submitting() ? 'Saving...' : 'Create Prompt' }}
          </button>
        </form>
      </div>
    </section>
  `
})
export class AddPromptPage {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PromptApiService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required, Validators.minLength(20)]],
    complexity: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    tags: ['']
  });

  protected isInvalid(controlName: 'title' | 'content' | 'complexity'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    const tags = this.form.value.tags
      ? this.form.value.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    this.api
      .createPrompt({
        title: this.form.value.title ?? '',
        content: this.form.value.content ?? '',
        complexity: Number(this.form.value.complexity ?? 1),
        tags
      })
      .subscribe({
        next: (prompt) => {
          this.submitting.set(false);
          this.toastService.success('Prompt created successfully.');
          this.router.navigate(['/prompts', prompt.id]);
        },
        error: (error) => {
          this.submitting.set(false);
          const message = error?.error?.error || 'Failed to create prompt. Make sure you are logged in.';
          this.errorMessage.set(message);
          this.toastService.error(message);
        }
      });
  }
}
