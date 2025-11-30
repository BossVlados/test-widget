import { makeAutoObservable } from 'mobx';
import { Product, CartItem, SortOrder, Dealer } from '../types/product';

const API_BASE = 'https://test-frontend.dev.int.perx.ru/api';

const CART_STORAGE_KEY = 'widget_cart';
const CART_TTL = 10 * 60 * 1000; // 10 minutes

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

  // Инициализация виджета с опциональным списком дилеров
  async initialize(dealerIds?: string[]) {
    this.dealerIds = dealerIds || [];
    await Promise.all([
      this.fetchDealers(),
      this.fetchProducts()
    ]);
  }

  // Загрузка списка дилеров
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

  // Загрузка товаров
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

  // Получить товары для главной страницы
  get homeProducts(): Product[] {
    // Товары с ценой >= 10
    const filtered = this.products.filter(p => p.price >= 10);
    
    if (filtered.length < 5) {
      // Если меньше 5, возвращаем любые 8
      return this.products.slice(0, 8);
    }
    
    return filtered.slice(0, 5);
  }

  // Получить отфильтрованные товары для каталога
  get filteredProducts(): Product[] {
    let filtered = [...this.products];

    // Фильтрация по дилерам
    if (this.selectedDealers.length > 0) {
      filtered = filtered.filter(p => this.selectedDealers.includes(p.dealer));
    }

    // Сортировка по цене
    if (this.sortOrder === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }

  // Количество товаров в корзине
  get cartItemsCount(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Общая стоимость корзины
  get cartTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Добавить товар в корзину
  addToCart(product: Product) {
    const existing = this.cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    
    this.saveCart();
  }

  // Удалить единицу товара из корзины
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

  // Удалить товар полностью из корзины
  removeFromCart(productId: number) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }

  // Очистить корзину
  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // Переключить фильтр дилера
  toggleDealerFilter(dealerId: string) {
    const index = this.selectedDealers.indexOf(dealerId);
    if (index > -1) {
      this.selectedDealers.splice(index, 1);
    } else {
      this.selectedDealers.push(dealerId);
    }
  }

  // Установить сортировку
  setSortOrder(order: SortOrder) {
    this.sortOrder = order;
  }

  // Сохранить корзину в localStorage
  private saveCart() {
    const data: StorageCart = {
      items: this.cart,
      timestamp: Date.now(),
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
  }

  // Загрузить корзину из localStorage
  private loadCart() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const data: StorageCart = JSON.parse(stored);
        const now = Date.now();
        
        // Проверяем TTL
        if (now - data.timestamp < CART_TTL) {
          this.cart = data.items;
        } else {
          // Удаляем устаревшие данные
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  // Проверить, есть ли товар в корзине
  isInCart(productId: number): boolean {
    return this.cart.some(item => item.id === productId);
  }

  // Получить количество товара в корзине
  getCartQuantity(productId: number): number {
    const item = this.cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }

  // Установить фильтры из URL
  setFiltersFromUrl(dealers: string[], sort: SortOrder) {
    this.selectedDealers = dealers;
    this.sortOrder = sort;
  }
}

export const widgetStore = new WidgetStore();