export interface Model3D {
  id: number;
  name: string;
  description: string | null;
  file_path: string;
  thumbnail_path: string | null;
  file_size: number;
  format: string;
  created_at: string;
  updated_at: string | null;
  created_by: number;
  is_active: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
} 