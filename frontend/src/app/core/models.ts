export interface Prompt {
  id: string;
  title: string;
  content: string;
  complexity: number;
  created_at: string;
  tags: string[];
  view_count?: number;
}

export interface Tag {
  id: string;
  name: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
}

export interface CreatePromptPayload {
  title: string;
  content: string;
  complexity: number;
  tags?: string[];
}
