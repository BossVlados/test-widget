import { makeAutoObservable } from 'mobx';
import { Product, CartItem, SortOrder, Dealer } from '../types/product';

const API_BASE = 'https://test-frontend.dev.int.perx.ru/api';

const CART_STORAGE_KEY = 'widget_cart';
const CART_TTL = 10 * 60 * 1000;

interface StorageCart {
  items: CartItem[];
  timestamp: number;
}

class WidgetStore {
  products: Product[] = [];
  cart: CartItem[] = [];
  selectedDealers: string[] = [];
  sortOrder: SortOrder = 'none';
  dealerIds: string[] = [];
  dealers: Dealer[] = [];
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.loadCart();
  }

  async initialize(dealerIds?: string[]) {
    this.dealerIds = dealerIds || [];
    await Promise.all([
      this.fetchDealers(),
      this.fetchProducts()
    ]);
  }

  async fetchDealers() {
    try {
      const response = await fetch(`${API_BASE}/dealers/`);
      const data = await response.json();
      this.dealers = data;
    } catch (error) {
      console.error('Error fetching dealers:', error);
      this.dealers = [];
    }
  }

  async fetchProducts() {
    this.loading = true;
    try {
      let url = `${API_BASE}/goods/`;
      if (this.dealerIds.length > 0) {
        url += `?dealers=${this.dealerIds.join(',')}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      this.products = data;
    } catch (error) {
      console.error('Error fetching products:', error);
      this.products = [];
    } finally {
      this.loading = false;
    }
  }

  get homeProducts(): Product[] {

    const filtered = this.products.filter(p => p.price >= 10);
    
    if (filtered.length < 5) {
      return this.products.slice(0, 8);
    }
    
    return filtered.slice(0, 5);
  }

  get filteredProducts(): Product[] {
    let filtered = [...this.products];

    if (this.selectedDealers.length > 0) {
      filtered = filtered.filter(p => this.selectedDealers.includes(p.dealer));
    }

    if (this.sortOrder === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }

  get cartItemsCount(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  get cartTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  addToCart(product: Product) {
    const existing = this.cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    
    this.saveCart();
  }

  removeOneFromCart(productId: number) {
    const item = this.cart.find(item => item.id === productId);
    
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.cart = this.cart.filter(item => item.id !== productId);
      }
      this.saveCart();
    }
  }

  removeFromCart(productId: number) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  toggleDealerFilter(dealerId: string) {
    const index = this.selectedDealers.indexOf(dealerId);
    if (index > -1) {
      this.selectedDealers.splice(index, 1);
    } else {
      this.selectedDealers.push(dealerId);
    }
  }

  setSortOrder(order: SortOrder) {
    this.sortOrder = order;
  }

  private saveCart() {
    const data: StorageCart = {
      items: this.cart,
      timestamp: Date.now(),
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
  }

  private loadCart() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const data: StorageCart = JSON.parse(stored);
        const now = Date.now();
        
        if (now - data.timestamp < CART_TTL) {
          this.cart = data.items;
        } else {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  isInCart(productId: number): boolean {
    return this.cart.some(item => item.id === productId);
  }

  getCartQuantity(productId: number): number {
    const item = this.cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }

  setFiltersFromUrl(dealers: string[], sort: SortOrder) {
    this.selectedDealers = dealers;
    this.sortOrder = sort;
  }
}

export const widgetStore = new WidgetStore();