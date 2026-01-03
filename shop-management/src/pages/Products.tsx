import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CustomProduct, Customer } from '../types';
import { getProducts, getCustomers, deleteProduct } from '../utils/storage';

export default function Products() {
  const [products, setProducts] = useState<CustomProduct[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProducts(getProducts());
    setCustomers(getCustomers());
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.companyName || '未知客戶';
  };

  const getStatusText = (product: CustomProduct) => {
    if (product.status.pickedUp) return '已取貨';
    if (product.status.arrived) return '已到貨';
    if (product.status.ordered) return '已下訂';
    return '待下訂';
  };

  const getStatusColor = (product: CustomProduct) => {
    if (product.status.pickedUp) return 'bg-gray-100 text-gray-800';
    if (product.status.arrived) return 'bg-green-100 text-green-800';
    if (product.status.ordered) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除此訂製品嗎？')) {
      deleteProduct(id);
      loadData();
    }
  };

  const filteredProducts = products.filter(product => {
    const customer = customers.find(c => c.id === product.customerId);
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      customer?.companyName.toLowerCase().includes(search) ||
      product.config.category.toLowerCase().includes(search) ||
      (product.config.subCategory?.toLowerCase().includes(search) || false);

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'ordered') return matchesSearch && product.status.ordered && !product.status.arrived;
    if (statusFilter === 'arrived') return matchesSearch && product.status.arrived && !product.status.pickedUp;
    if (statusFilter === 'pickedUp') return matchesSearch && product.status.pickedUp;
    if (statusFilter === 'pending') return matchesSearch && !product.status.ordered;

    return matchesSearch;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">訂製品管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理所有訂製品的下訂、到貨、取貨狀態
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            to="/products/new"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            新增訂製品
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input
          type="text"
          placeholder="搜尋客戶、類別..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部狀態</option>
          <option value="pending">待下訂</option>
          <option value="ordered">已下訂</option>
          <option value="arrived">已到貨</option>
          <option value="pickedUp">已取貨</option>
        </select>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      客戶
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      類別
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      規格
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      狀態
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      建立日期
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">操作</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {getCustomerName(product.customerId)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.config.category} - {product.config.subCategory || ''}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {product.config.specifications.length && product.config.specifications.width
                          ? `${product.config.specifications.length}×${product.config.specifications.width}cm`
                          : product.config.specifications.length
                          ? `${product.config.specifications.length}cm`
                          : '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(product)}`}>
                          {getStatusText(product)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString('zh-TW')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          to={`/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          查看
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          刪除
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-sm text-gray-500">
                        {searchTerm || statusFilter !== 'all' ? '找不到符合的訂製品' : '目前沒有訂製品資料'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
