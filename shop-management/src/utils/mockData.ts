import type { Customer, CustomProduct } from '../types';

// 假客戶資料
export const mockCustomers: Customer[] = [
  {
    id: '1',
    companyName: '台灣科技股份有限公司',
    taxId: '12345678',
    systemLocation: 'TW-SYS-001',
    contactPerson: '王小明',
    phone: '02-1234-5678',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    companyName: '創新企業有限公司',
    taxId: '23456789',
    systemLocation: 'TW-SYS-002',
    contactPerson: '李美麗',
    phone: '02-2345-6789',
    createdAt: new Date('2024-02-20').toISOString()
  },
  {
    id: '3',
    companyName: '永續發展集團',
    taxId: '34567890',
    systemLocation: 'TW-SYS-003',
    contactPerson: '張大華',
    phone: '02-3456-7890',
    createdAt: new Date('2024-03-10').toISOString()
  },
  {
    id: '4',
    companyName: '智慧製造公司',
    taxId: '45678901',
    systemLocation: 'TW-SYS-004',
    contactPerson: '陳建國',
    phone: '02-4567-8901',
    createdAt: new Date('2024-04-05').toISOString()
  },
  {
    id: '5',
    companyName: '綠能環保企業',
    taxId: '56789012',
    systemLocation: 'TW-SYS-005',
    contactPerson: '林雅婷',
    phone: '02-5678-9012',
    createdAt: new Date('2024-05-12').toISOString()
  }
];

// 假訂製品資料
export const mockProducts: CustomProduct[] = [
  {
    id: '1',
    customerId: '1',
    config: {
      category: '出風口',
      subCategory: '線型',
      material: 'ABS',
      color: '黑',
      specifications: {
        length: 120,
        bracketWidth: 15
      }
    },
    systemInfo: {
      priceFormula: '$360/米',
      calculatedPrice: 43200,
      vendor: 'A',
      systemLocation: 'A區-1排-3號'
    },
    status: {
      ordered: true,
      orderedDate: new Date('2024-06-01').toISOString(),
      arrived: true,
      arrivedDate: new Date('2024-06-15').toISOString(),
      pickedUp: false,
      productCreated: false
    },
    createdAt: new Date('2024-05-28').toISOString(),
    updatedAt: new Date('2024-06-15').toISOString(),
    notes: '客戶要求黑色無框線型出風口'
  },
  {
    id: '2',
    customerId: '2',
    config: {
      category: '集風箱',
      subCategory: '簡易型',
      specifications: {
        length: 60,
        width: 40,
        holeSize: '8'
      }
    },
    systemInfo: {
      priceFormula: '成本價 X 1.45 (成本$288，售價都算$400)',
      calculatedPrice: 400,
      vendor: '美璟',
      systemLocation: 'B區-2排-5號'
    },
    status: {
      ordered: true,
      orderedDate: new Date('2024-06-10').toISOString(),
      arrived: false,
      pickedUp: false,
      productCreated: false
    },
    createdAt: new Date('2024-06-08').toISOString(),
    updatedAt: new Date('2024-06-10').toISOString()
  }
];

// 初始化假資料
export const initializeMockData = (): void => {
  const existingCustomers = localStorage.getItem('shop_customers');
  const existingProducts = localStorage.getItem('shop_products');

  if (!existingCustomers) {
    localStorage.setItem('shop_customers', JSON.stringify(mockCustomers));
  }

  if (!existingProducts) {
    localStorage.setItem('shop_products', JSON.stringify(mockProducts));
  }
};
