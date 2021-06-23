export interface ResponseAPI {
  count: number;
  next: string;
  previous: string;
  results: any[];
}

export interface Pagination {
  length?: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex?: number;
}

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';
