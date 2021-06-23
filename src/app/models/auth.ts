export interface Token {
  refresh: string;
  access: string;
  id: string;
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
  password?: string;
  bio?: string;
  photo?: string;
}
