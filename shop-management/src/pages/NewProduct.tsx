import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Customer, ProductConfig, CustomProduct } from '../types';
import { getCustomers, addProduct } from '../utils/storage';
import { calculatePrice, getVendor, getSystemLocation } from '../utils/priceCalculator';

export default function NewProduct() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [step, setStep] = useState(1);

  // 選擇的資料
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [frameType, setFrameType] = useState(''); // 有框/無框
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [bracketWidth, setBracketWidth] = useState('');
  const [holeSize, setHoleSize] = useState('');
  const [customType, setCustomType] = useState('');
  const [hasNet, setHasNet] = useState<boolean | null>(null);
  const [netColor, setNetColor] = useState('');
  const [hasFrame, setHasFrame] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  const handleSubmit = () => {
    const config: ProductConfig = {
      category,
      subCategory,
      material,
      color,
      specifications: {
        length: length ? parseFloat(length) : undefined,
        width: width ? parseFloat(width) : undefined,
        bracketWidth: bracketWidth ? parseFloat(bracketWidth) : undefined,
        holeSize,
        customType
      },
      hasNet: hasNet ?? undefined,
      netColor,
      hasFrame: hasFrame ?? undefined
    };

    const { formula, price } = calculatePrice(config);
    const vendor = getVendor(config);
    const systemLocation = getSystemLocation(config);

    const product: CustomProduct = {
      id: Date.now().toString(),
      customerId: selectedCustomerId,
      config,
      systemInfo: {
        priceFormula: formula,
        calculatedPrice: price,
        vendor,
        systemLocation
      },
      status: {
        ordered: false,
        arrived: false,
        pickedUp: false,
        productCreated: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes
    };

    addProduct(product);
    navigate('/products');
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">步驟 1: 選擇客戶</h2>
      <select
        value={selectedCustomerId}
        onChange={(e) => setSelectedCustomerId(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">請選擇客戶</option>
        {customers.map(customer => (
          <option key={customer.id} value={customer.id}>
            {customer.companyName} ({customer.taxId})
          </option>
        ))}
      </select>
      <button
        onClick={() => setStep(2)}
        disabled={!selectedCustomerId}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        下一步
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">步驟 2: 選擇材料類型</h2>
      <div className="grid grid-cols-2 gap-4">
        {['出風口', '集風箱', '線型風箱', '線型迴風版'].map(cat => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setStep(3); }}
            className="p-4 border-2 border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50"
          >
            {cat}
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep(1)}
        className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
      >
        上一步
      </button>
    </div>
  );

  const renderStep3 = () => {
    if (category === '出風口') {
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">步驟 3: 選擇子類別</h2>
          <div className="grid grid-cols-2 gap-4">
            {['線型', '格柵'].map(sub => (
              <button
                key={sub}
                onClick={() => { setSubCategory(sub); setStep(4); }}
                className="p-4 border-2 border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50"
              >
                {sub}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            上一步
          </button>
        </div>
      );
    } else if (category === '集風箱') {
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">步驟 3: 選擇類型</h2>
          <div className="grid grid-cols-2 gap-4">
            {['簡易型', '一般型'].map(sub => (
              <button
                key={sub}
                onClick={() => { setSubCategory(sub); setStep(5); }}
                className="p-4 border-2 border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50"
              >
                {sub}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            上一步
          </button>
        </div>
      );
    } else if (category === '線型風箱') {
      return renderSpecifications();
    } else if (category === '線型迴風版') {
      return renderLinearReturnAir();
    }
  };

  const renderStep4 = () => {
    if (subCategory === '線型') {
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">步驟 4: 選擇框型</h2>
          <div className="grid grid-cols-2 gap-4">
            {['無框', '有框'].map(frame => (
              <button
                key={frame}
                onClick={() => { setFrameType(frame); setStep(frame === '無框' ? 6 : 5); }}
                className="p-4 border-2 border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50"
              >
                {frame}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(3)}
            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            上一步
          </button>
        </div>
      );
    } else if (subCategory === '格柵') {
      return renderActivityType();
    }
  };

  const renderStep5 = () => {
    if (frameType === '有框') {
      return renderActivityType();
    }
  };

  const renderActivityType = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">選擇活動類型</h2>
      <div className="grid grid-cols-2 gap-4">
        {['活動', '固定'].map(type => (
          <button
            key={type}
            onClick={() => { setStep(6); }}
            className="p-4 border-2 border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50"
          >
            {type}
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep(subCategory === '線型' ? 4 : 3)}
        className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
      >
        上一步
      </button>
    </div>
  );

  const renderStep6 = () => {
    if (frameType === '無框' && subCategory === '線型') {
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">選擇材質</h2>
          <div className="grid grid-cols-2 gap-4">
            {['ABS', '鋁製'].map(mat => (
              <button
                key={mat}
                onClick={() => { setMaterial(mat); setStep(7); }}
                className="p-4 border-2 border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50"
              >
                {mat}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(4)}
            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            上一步
          </button>
        </div>
      );
    } else {
      setMaterial('ABS');
      return renderColorSelection();
    }
  };

  const renderStep7 = () => {
    if (material === '鋁製') {
      setColor('原色');
      return renderSpecifications();
    } else {
      return renderColorSelection();
    }
  };

  const renderColorSelection = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">選擇顏色</h2>
      <div className="grid grid-cols-2 gap-4">
        {['黑', '白'].map(col => (
          <button
            key={col}
            onClick={() => { setColor(col); setStep(8); }}
            className="p-4 border-2 border-gray-300 rounded-md hover:border-blue-500 hover:bg-blue-50"
          >
            {col}
          </button>
        ))}
      </div>
      <button
        onClick={() => setStep(frameType === '無框' ? 6 : 5)}
        className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
      >
        上一步
      </button>
    </div>
  );

  const renderSpecifications = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">輸入規格</h2>

      {(category === '線型風箱') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">類型（側吹、下吹等）</label>
          <input
            type="text"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            placeholder="請輸入類型，例如：側吹、下吹"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {category === '出風口' && subCategory === '線型' && frameType === '無框' ? '長度 (米)' : '長度 (cm)'}
          </label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="請輸入長度"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {(category !== '出風口' || frameType !== '無框' || subCategory !== '線型') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">寬度 (cm)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="請輸入寬度"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {category === '出風口' && subCategory === '線型' && frameType === '無框' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">支架寬度 (cm)</label>
          <input
            type="number"
            value={bracketWidth}
            onChange={(e) => setBracketWidth(e.target.value)}
            placeholder="請輸入支架寬度"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {(category === '集風箱' || category === '線型風箱') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">孔徑尺寸</label>
          <select
            value={holeSize}
            onChange={(e) => setHoleSize(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">請選擇孔徑</option>
            {['4', '6', '8', '10', '12', '14'].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">備註</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="選填：其他備註事項"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(category === '線型風箱' ? 2 : 7)}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
        >
          上一步
        </button>
        <button
          onClick={handleSubmit}
          disabled={!length || (category !== '出風口' && !width)}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          建立訂製品
        </button>
      </div>
    </div>
  );

  const renderLinearReturnAir = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">線型迴風版配置</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">是否含網</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { setHasNet(true); setStep(4); }}
            className={`p-4 border-2 rounded-md ${hasNet === true ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
          >
            是
          </button>
          <button
            onClick={() => { setHasNet(false); setStep(5); }}
            className={`p-4 border-2 rounded-md ${hasNet === false ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
          >
            否
          </button>
        </div>
      </div>

      {hasNet === true && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">網子顏色</label>
          <div className="grid grid-cols-2 gap-4">
            {['黑', '白'].map(col => (
              <button
                key={col}
                onClick={() => setNetColor(col)}
                className={`p-4 border-2 rounded-md ${netColor === col ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
              >
                {col}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">是否含框</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setHasFrame(true)}
            className={`p-4 border-2 rounded-md ${hasFrame === true ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
          >
            是
          </button>
          <button
            onClick={() => setHasFrame(false)}
            className={`p-4 border-2 rounded-md ${hasFrame === false ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
          >
            否
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">備註</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="選填：其他備註事項"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
        >
          上一步
        </button>
        <button
          onClick={handleSubmit}
          disabled={hasNet === null || hasFrame === null}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          建立訂製品
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">新增訂製品</h1>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}
          {step === 7 && renderStep7()}
          {step === 8 && renderSpecifications()}
        </div>
      </div>
    </div>
  );
}
