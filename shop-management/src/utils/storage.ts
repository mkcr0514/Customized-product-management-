import type { Customer, CustomProduct } from '../types';

const CUSTOMERS_KEY = 'shop_customers';
const PRODUCTS_KEY = 'shop_products';
const AUTH_KEY = 'shop_auth';

// 客戶資料存取
export const getCustomers = (): Customer[] => {
  const data = localStorage.getItem(CUSTOMERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCustomers = (customers: Customer[]): void => {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
};

export const addCustomer = (customer: Customer): void => {
  const customers = getCustomers();
  customers.push(customer);
  saveCustomers(customers);
};

export const updateCustomer = (id: string, updates: Partial<Customer>): void => {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...updates };
    saveCustomers(customers);
  }
};

export const deleteCustomer = (id: string): void => {
  const customers = getCustomers();
  saveCustomers(customers.filter(c => c.id !== id));
};

// 訂製品資料存取
export const getProducts = (): CustomProduct[] => {
  const data = localStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProducts = (products: CustomProduct[]): void => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const addProduct = (product: CustomProduct): void => {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
};

export const updateProduct = (id: string, updates: Partial<CustomProduct>): void => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
  }
};

export const deleteProduct = (id: string): void => {
  const products = getProducts();
  saveProducts(products.filter(p => p.id !== id));
};

// 認證
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const login = (password: string): boolean => {
  if (password === 'sk8243') {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};
