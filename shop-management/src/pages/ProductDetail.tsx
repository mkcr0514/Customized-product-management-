import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { CustomProduct, Customer } from '../types';
import { getProducts, getCustomers, updateProduct } from '../utils/storage';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<CustomProduct | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showProductInfo, setShowProductInfo] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = () => {
    const products = getProducts();
    const found = products.find(p => p.id === id);
    if (found) {
      setProduct(found);
      const customers = getCustomers();
      const cust = customers.find(c => c.id === found.customerId);
      setCustomer(cust || null);
    }
  };

  const handleOrder = () => {
    if (product && !product.status.ordered) {
      updateProduct(product.id, {
        status: {
          ...product.status,
          ordered: true,
          orderedDate: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      });
      loadData();
    }
  };

  const handleArrived = () => {
    if (product && product.status.ordered && !product.status.arrived) {
      updateProduct(product.id, {
        status: {
          ...product.status,
          arrived: true,
          arrivedDate: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      });
      loadData();
    }
  };

  const handlePickedUp = () => {
    if (product && product.status.arrived && !product.status.pickedUp) {
      updateProduct(product.id, {
        status: {
          ...product.status,
          pickedUp: true,
          pickedUpDate: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      });
      loadData();
    }
  };

  const handleCreateProduct = () => {
    if (product) {
      setShowProductInfo(true);
      if (!product.status.productCreated) {
        updateProduct(product.id, {
          status: {
            ...product.status,
            productCreated: true,
            productCreatedDate: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        });
        loadData();
      }
    }
  };

  if (!product || !customer) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-gray-500">找不到訂製品資料</p>
          <Link to="/products" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  const getConfigDetails = () => {
    const { config } = product;
    const details = [];

    details.push({ label: '類別', value: config.category });
    if (config.subCategory) details.push({ label: '子類別', value: config.subCategory });
    if (config.material) details.push({ label: '材質', value: config.material });
    if (config.color) details.push({ label: '顏色', value: config.color });

    if (config.specifications.length) {
      details.push({ label: '長度', value: `${config.specifications.length} ${config.category === '出風口' && !config.specifications.width ? '米' : 'cm'}` });
    }
    if (config.specifications.width) {
      details.push({ label: '寬度', value: `${config.specifications.width} cm` });
    }
    if (config.specifications.bracketWidth) {
      details.push({ label: '支架寬度', value: `${config.specifications.bracketWidth} cm` });
    }
    if (config.specifications.holeSize) {
      details.push({ label: '孔徑尺寸', value: config.specifications.holeSize });
    }
    if (config.specifications.customType) {
      details.push({ label: '類型', value: config.specifications.customType });
    }
    if (config.hasNet !== undefined) {
      details.push({ label: '是否含網', value: config.hasNet ? '是' : '否' });
    }
    if (config.netColor) {
      details.push({ label: '網子顏色', value: config.netColor });
    }
    if (config.hasFrame !== undefined) {
      details.push({ label: '是否含框', value: config.hasFrame ? '是' : '否' });
    }

    return details;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/products" className="text-blue-600 hover:text-blue-800">
            ← 返回列表
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              訂製品詳細資訊
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              客戶：{customer.companyName}
            </p>
          </div>

          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">客戶資訊</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div>{customer.companyName}</div>
                  <div className="text-gray-500">統編：{customer.taxId}</div>
                  <div className="text-gray-500">系統位置：{customer.systemLocation}</div>
                </dd>
              </div>

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">產品配置</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {getConfigDetails().map((detail, index) => (
                    <div key={index} className="mb-1">
                      <span className="font-medium">{detail.label}：</span>
                      {detail.value}
                    </div>
                  ))}
                </dd>
              </div>

              {product.notes && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">備註</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product.notes}
                  </dd>
                </div>
              )}

              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">建立時間</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(product.createdAt).toLocaleString('zh-TW')}
                </dd>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">更新時間</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(product.updatedAt).toLocaleString('zh-TW')}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              訂單狀態管理
            </h3>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <button
                  onClick={handleOrder}
                  disabled={product.status.ordered}
                  className={`w-full py-3 px-4 rounded-md font-medium ${
                    product.status.ordered
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {product.status.ordered ? '✓ 已下訂' : '下訂'}
                </button>
                {product.status.orderedDate && (
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    {new Date(product.status.orderedDate).toLocaleDateString('zh-TW')}
                  </p>
                )}
              </div>

              <div>
                <button
                  onClick={handleArrived}
                  disabled={!product.status.ordered || product.status.arrived}
                  className={`w-full py-3 px-4 rounded-md font-medium ${
                    product.status.arrived
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : product.status.ordered
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.status.arrived ? '✓ 已到貨' : '到貨'}
                </button>
                {product.status.arrivedDate && (
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    {new Date(product.status.arrivedDate).toLocaleDateString('zh-TW')}
                  </p>
                )}
              </div>

              <div>
                <button
                  onClick={handleCreateProduct}
                  disabled={!product.status.arrived}
                  className={`w-full py-3 px-4 rounded-md font-medium ${
                    product.status.productCreated
                      ? 'bg-green-100 text-green-800'
                      : product.status.arrived
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.status.productCreated ? '✓ 已建立商品' : '建立商品'}
                </button>
                {product.status.productCreatedDate && (
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    {new Date(product.status.productCreatedDate).toLocaleDateString('zh-TW')}
                  </p>
                )}
              </div>

              <div>
                <button
                  onClick={handlePickedUp}
                  disabled={!product.status.arrived || product.status.pickedUp}
                  className={`w-full py-3 px-4 rounded-md font-medium ${
                    product.status.pickedUp
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : product.status.arrived
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.status.pickedUp ? '✓ 已取貨' : '取貨'}
                </button>
                {product.status.pickedUpDate && (
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    {new Date(product.status.pickedUpDate).toLocaleDateString('zh-TW')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {showProductInfo && (
          <div className="mt-6 bg-blue-50 border border-blue-200 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-blue-900">
                建立商品資訊
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                請使用以下資訊在系統中建立商品
              </p>
            </div>

            <div className="border-t border-blue-200 bg-white">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">價格計算公式</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product.systemInfo.priceFormula}
                  </dd>
                </div>

                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">計算價格</dt>
                  <dd className="mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2">
                    NT$ {product.systemInfo.calculatedPrice?.toLocaleString()}
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">廠商</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product.systemInfo.vendor}
                  </dd>
                </div>

                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">系統位置（倉庫位置）</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product.systemInfo.systemLocation}
                  </dd>
                </div>

                {product.systemInfo.material && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">材質</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {product.systemInfo.material}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
