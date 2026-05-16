import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ExchangeRates {
  [key: string]: number;
}

interface ExchangeData {
  result: string;
  base_code: string;
  conversion_rates: ExchangeRates;
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly API_KEY = '81decd2b05eb00942b917956';
  private readonly BASE_URL = 'https://v6.exchangerate-api.com/v6';
  private readonly STORAGE_KEY = 'aromic_currency_data';

  private rates: ExchangeRates | null = null;
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 3600000;

  // ✅ Add BehaviorSubject to notify components of currency changes
  private currencySubject = new BehaviorSubject<string>(this.getSavedCurrency());
  currencyChanged$ = this.currencySubject.asObservable();

  currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  ];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      this.rates = data.rates;
      this.lastFetch = data.timestamp;
      console.log('📦 Loaded exchange rates from cache');
    }
  }

  private saveToStorage() {
    const data = {
      rates: this.rates,
      timestamp: this.lastFetch,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private isCacheValid(): boolean {
    return this.rates !== null && (Date.now() - this.lastFetch) < this.CACHE_DURATION;
  }

  async fetchRates(): Promise<boolean> {
    if (this.isCacheValid()) {
      console.log('✅ Using cached exchange rates');
      return true;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/${this.API_KEY}/latest/USD`);
      const data: ExchangeData = await response.json();

      if (data.result === 'success') {
        this.rates = data.conversion_rates;
        this.lastFetch = Date.now();
        this.saveToStorage();
        console.log('✅ Exchange rates updated');
        console.log('💱 USD to PHP:', data.conversion_rates['PHP']);
        return true;
      } else {
        console.error('❌ Failed to fetch exchange rates');
        return false;
      }
    } catch (error) {
      console.error('❌ Error fetching exchange rates:', error);
      return false;
    }
  }

  convertPrice(priceUSD: number, targetCurrency: string): number {
    if (!this.rates || !this.rates[targetCurrency]) {
      return priceUSD;
    }
    return priceUSD * this.rates[targetCurrency];
  }

  formatPrice(priceUSD: number, targetCurrency: string): string {
    const converted = this.convertPrice(priceUSD, targetCurrency);
    const currency = this.currencies.find((c) => c.code === targetCurrency);

    if (!currency) return `$${priceUSD.toFixed(2)}`;

    switch (targetCurrency) {
      case 'JPY':
        return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
      case 'PHP':
      case 'EUR':
      case 'GBP':
      case 'AUD':
        return `${currency.symbol}${converted.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      default:
        return `${currency.symbol}${converted.toFixed(2)}`;
    }
  }

  getSavedCurrency(): string {
    return localStorage.getItem('aromic_currency') || 'USD';
  }

  getSelectedCurrency(): string {
    return this.getSavedCurrency();
  }

  // ✅ Updated to notify subscribers
  setSelectedCurrency(currency: string) {
    localStorage.setItem('aromic_currency', currency);
    this.currencySubject.next(currency); // Notify all subscribers
    console.log('💱 Currency changed to:', currency);
  }

  getCurrencySymbol(currencyCode: string): string {
    const currency = this.currencies.find((c) => c.code === currencyCode);
    return currency ? currency.symbol : '$';
  }

  getCurrencies() {
    return this.currencies;
  }
}