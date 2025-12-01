export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  dealer: string;
}

export interface Dealer {
  id: string;
  name: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartItem extends Product {
  quantity: number;
}


export type SortOrder = 'none' | 'asc' | 'desc';