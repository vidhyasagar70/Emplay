import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from './api';
import { CreatePromptPayload, LoginResponse, Prompt, Tag } from './models';

@Injectable({ providedIn: 'root' })
export class PromptApiService {
  private readonly http = inject(HttpClient);

  getPrompts(tag?: string): Observable<Prompt[]> {
    const params = tag ? new HttpParams().set('tag', tag) : undefined;
    return this.http.get<Prompt[]>(`${API_BASE_URL}/prompts`, { params });
  }

  getPromptById(id: string): Observable<Prompt> {
    return this.http.get<Prompt>(`${API_BASE_URL}/prompts/${id}`);
  }

  createPrompt(payload: CreatePromptPayload): Observable<Prompt> {
    return this.http.post<Prompt>(`${API_BASE_URL}/prompts`, payload);
  }

  login(username: string, password: string): Observable<string> {
    return this.http
      .post<LoginResponse>(`${API_BASE_URL}/auth/login`, { username, password })
      .pipe(map((response) => response.access_token));
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${API_BASE_URL}/tags`);
  }
}
