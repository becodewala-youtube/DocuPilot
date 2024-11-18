export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface Parameter {
  key: string;
  value: string;
  description?: string;
}

export interface ApiRequest {
  baseUrl: string;
  method: HttpMethod;
  headers: Parameter[];
  queryParams: Parameter[];
  body: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
}

export interface SavedConfig {
  id: string;
  name: string;
  request: ApiRequest;
}