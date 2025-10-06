export interface ProductSize {
  value: string;
  available: boolean;
}

export interface Product {
  id: number;
  title: string;
  brand: string;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  rating?: number | null;
  reviewsCount?: number;
  image: string;
  inStock: boolean;
  sizes: ProductSize[];
  colorHex?: string;
}

export interface FavoritesData {
  items: Product[];
}

export type StarType = 'full' | 'half' | 'empty';

export type ButtonType = 'primary' | 'outline-primary';

export interface ButtonConfig {
  text: string;
  type: ButtonType;
  disabled?: boolean;
  dataAttributes?: Record<string, string | number>;
  ariaLabel?: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}
