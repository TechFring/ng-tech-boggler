import { User } from './auth';

export interface Publication {
  id?: string;
  title: string;
  subtitle: string;
  content: string;
  cover: string;
  user?: User;
  tags?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Saved {
  id: string;
  user: User;
  publication: Publication;
  created_at: string;
  updated_at: string;
}

export type CardPublicationMode = 'myPublication' | 'saved' | undefined;
