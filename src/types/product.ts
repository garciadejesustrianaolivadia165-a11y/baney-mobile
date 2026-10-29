export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  currency?: string; // "RD$" por defecto
  rating: number; // 0 a 5
  seller: {
    name: string;
    avatar: string;
    location: string;
  };
  isFavorite?: boolean;
}
