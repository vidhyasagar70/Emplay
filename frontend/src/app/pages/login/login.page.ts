import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromptApiService } from '../../core/prompt-api.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-8">
      <div class="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-bold text-slate-900">Login</h1>
        <p class="mt-1 text-sm text-slate-600">Login to create prompts.</p>

        @if (errorMessage()) {
          <p class="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{{ errorMessage() }}</p>
        }

        <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700" for="username">Username</label>
            <input id="username" formControlName="username" class="w-full rounded-md border border-slate-300 px-3 py-2" />
            @if (isInvalid('username')) {
              <p class="mt-1 text-sm text-red-600">Username is required.</p>
            }
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700" for="password">Password</label>
            <input id="password" type="password" formControlName="password" class="w-full rounded-md border border-slate-300 px-3 py-2" />
            @if (isInvalid('password')) {
              <p class="mt-1 text-sm text-red-600">Password is required.</p>
            }
          </div>

          <button
            type="submit"
            class="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
            [disabled]="form.invalid || submitting()"
          >
            {{ submitting() ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </section>
  `
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PromptApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  protected isInvalid(controlName: 'username' | 'password'): boolean {
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

    this.api.login(this.form.value.username ?? '', this.form.value.password ?? '').subscribe({
      next: (token) => {
        this.auth.setToken(token);
        this.toastService.success('Logged in successfully.');
        this.submitting.set(false);
        this.router.navigate(['/add']);
      },
      error: (error) => {
        this.submitting.set(false);
        const message = error?.error?.error || 'Invalid credentials.';
        this.errorMessage.set(message);
        this.toastService.error(message);
      }
    });
  }
}
