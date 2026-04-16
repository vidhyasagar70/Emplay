import { Routes } from '@angular/router';
import { PromptListPage } from './pages/prompt-list/prompt-list.page';
import { PromptDetailPage } from './pages/prompt-detail/prompt-detail.page';
import { AddPromptPage } from './pages/add-prompt/add-prompt.page';
import { LoginPage } from './pages/login/login.page';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
	{ path: '', component: PromptListPage },
	{ path: 'prompts/:id', component: PromptDetailPage },
	{ path: 'add', component: AddPromptPage, canActivate: [authGuard] },
	{ path: 'login', component: LoginPage },
	{ path: '**', redirectTo: '' }
];
