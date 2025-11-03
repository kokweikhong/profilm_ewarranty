export interface ProductBrand {
  id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProductBrandCreateRequest {
  name: string;
  is_active?: boolean;
}
