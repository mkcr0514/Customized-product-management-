import type { ProductConfig } from '../types';

// 根據產品配置計算價格
export const calculatePrice = (config: ProductConfig): { formula: string; price: number } => {
  const { category, subCategory, material, specifications } = config;
  const { length = 0, width = 0 } = specifications;

  // 出風口
  if (category === '出風口') {
    if (subCategory === '線型') {
      if (material === 'ABS') {
        // 無框 ABS: $360/米
        return {
          formula: '$360/米',
          price: length * 360
        };
      } else if (material === '鋁製') {
        // 鋁製: $580/米
        return {
          formula: '$580/米',
          price: length * 580
        };
      }
    } else if (subCategory === '有框' || subCategory === '格柵') {
      // 有框/格柵 ABS: (長度+寬度) X 36 或 55
      const multiplier = subCategory === '有框' ? 36 : 55;
      return {
        formula: `(長度+寬度) X ${multiplier}`,
        price: (length + width) * multiplier
      };
    }
  }

  // 集風箱、線型風箱、線型迴風版
  if (category === '集風箱' || category === '線型風箱' || category === '線型迴風版') {
    // 成本價 X 1.45，成本$288，售價都算$400
    return {
      formula: '成本價 X 1.45 (成本$288，售價都算$400)',
      price: 400
    };
  }

  return {
    formula: '無法計算',
    price: 0
  };
};

// 根據產品配置獲取廠商
export const getVendor = (config: ProductConfig): string => {
  const { category, subCategory, material } = config;

  if (category === '出風口') {
    if (subCategory === '線型' && material === 'ABS') {
      return 'A';
    } else if (subCategory === '線型' && material === '鋁製') {
      return 'B';
    } else if (subCategory === '有框' || subCategory === '格柵') {
      return 'C';
    }
  }

  if (category === '集風箱' || category === '線型風箱' || category === '線型迴風版') {
    return '美璟';
  }

  return '未知廠商';
};

// 獲取系統位置（假資料）
export const getSystemLocation = (config: ProductConfig): string => {
  const locations = [
    'A區-1排-3號',
    'B區-2排-5號',
    'C區-3排-1號',
    'A區-4排-2號',
    'B區-1排-4號'
  ];
  // 簡單的哈希來確定位置
  const hash = (config.category + config.subCategory + config.material).length;
  return locations[hash % locations.length];
};
