// 客戶資料類型
export interface Customer {
  id: string;
  companyName: string;
  taxId: string; // 統編
  systemLocation: string; // 系統位置
  contactPerson?: string;
  phone?: string;
  createdAt: string;
}

// 訂製品狀態
export interface OrderStatus {
  ordered: boolean;
  orderedDate?: string;
  arrived: boolean;
  arrivedDate?: string;
  pickedUp: boolean;
  pickedUpDate?: string;
  productCreated: boolean;
  productCreatedDate?: string;
}

// 產品配置選項
export interface ProductConfig {
  category: string; // 出風口、集風箱、線型風箱、線型迴風版
  subCategory?: string;
  material?: string;
  color?: string;
  specifications: {
    length?: number;
    width?: number;
    bracketWidth?: number;
    model?: string;
    holeSize?: string;
    customType?: string; // 側吹、下吹等
  };
  hasNet?: boolean;
  netColor?: string;
  hasFrame?: boolean;
}

// 系統資料（價格計算、廠商等）
export interface SystemInfo {
  priceFormula: string;
  calculatedPrice?: number;
  vendor: string;
  systemLocation: string;
  material?: string;
}

// 訂製品
export interface CustomProduct {
  id: string;
  customerId: string;
  config: ProductConfig;
  systemInfo: SystemInfo;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}
