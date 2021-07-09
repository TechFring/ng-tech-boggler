export interface Token {
  access: string;
  refresh: string;
}

export interface Account {
  username: string;
  password: string;
}

export interface User {
  id?: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  date_joined?: string;
  password?: string;
  bio?: string;
  photo?: string;
  is_active?: boolean;
}
