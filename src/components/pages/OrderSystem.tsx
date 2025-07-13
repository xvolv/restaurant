import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, CreditCard, DollarSign, Receipt, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme, themes } from '../../contexts/ThemeContext';

interface MenuItem {
  id: string;
  name: string;
  nameAm: string;
  price: number;
  category: string;
  image: string;
  description: string;
  descriptionAm: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

const orderSystem: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, mode } = useTheme();
  const currentTheme = themes[theme];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Items', nameAm: 'ሁሉም እቃዎች' },
    { id: 'appetizers', name: 'Appetizers', nameAm: 'ክፍተት ሙሪዎች' },
    { id: 'mains', name: 'Main Courses', nameAm: 'ዋና ምግቦች' },
    { id: 'desserts', name: 'Desserts', nameAm: 'ጣፋጭ ምግቦች' },
    { id: 'beverages', name: 'Beverages', nameAm: 'መጠጦች' },
    { id: 'traditional', name: 'Traditional', nameAm: 'ባህላዊ' }
  ];

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Doro Wot',
      nameAm: 'ዶሮ ወጥ',
      price: 450,
      category: 'traditional',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      description: 'Traditional Ethiopian chicken stew with berbere spice',
      descriptionAm: 'በበርበሬ ቅመም የተሰራ ባህላዊ የኢትዮጵያ የዶሮ ወጥ'
    },
    {
      id: '2',
      name: 'Kitfo',
      nameAm: 'ክትፎ',
      price: 380,
      category: 'traditional',
      image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
      description: 'Ethiopian steak tartare with mitmita spice',
      descriptionAm: 'በሚጥሚጣ ቅመም የተሰራ የኢትዮጵያ ጥሬ ስጋ'
    },
    {
      id: '3',
      name: 'Vegetarian Combo',
      nameAm: 'የአትክልት ቅልቅል',
      price: 320,
      category: 'traditional',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
      description: 'Assorted vegetarian dishes with injera',
      descriptionAm: 'ከእንጀራ ጋር የተለያዩ የአትክልት ምግቦች'
    },
    {
      id: '4',
      name: 'Tibs',
      nameAm: 'ጥብስ',
      price: 420,
      category: 'mains',
      image: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg',
      description: 'Sautéed beef with onions and peppers',
      descriptionAm: 'በሽንኩርት እና በበርበሬ የተጠበሰ ስጋ'
    },
    {
      id: '5',
      name: 'Fish Fillet',
      nameAm: 'የዓሳ ፊሌት',
      price: 480,
      category: 'mains',
      image: 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg',
      description: 'Grilled fish with Ethiopian spices',
      descriptionAm: 'በኢትዮጵያ ቅመሞች የተጠበሰ ዓሳ'
    },
    {
      id: '6',
      name: 'Ethiopian Coffee',
      nameAm: 'የኢትዮጵያ ቡና',
      price: 80,
      category: 'beverages',
      image: 'https://images.pexels.com/photos/1640778/pexels-photo-1640778.jpeg',
      description: 'Traditional Ethiopian coffee ceremony',
      descriptionAm: 'ባህላዊ የኢትዮጵያ የቡና ሥነ ሥርዓት'
    },
    {
      id: '7',
      name: 'Honey Wine',
      nameAm: 'ማር ወይን',
      price: 150,
      category: 'beverages',
      image: 'https://images.pexels.com/photos/1640779/pexels-photo-1640779.jpeg',
      description: 'Traditional Ethiopian honey wine (Tej)',
      descriptionAm: 'ባህላዊ የኢትዮጵያ የማር ወይን (ጠጅ)'
    },
    {
      id: '8',
      name: 'Baklava',
      nameAm: 'ባክላቫ',
      price: 120,
      category: 'desserts',
      image: 'https://images.pexels.com/photos/1640780/pexels-photo-1640780.jpeg',
      description: 'Sweet pastry with nuts and honey',
      descriptionAm: 'በለውዝ እና በማር የተሰራ ጣፋጭ ኬክ'
    }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.nameAm.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const addToOrder = (item: MenuItem) => {
    setOrderItems(prev => {
      const existing = prev.find(orderItem => orderItem.id === item.id);
      if (existing) {
        return prev.map(orderItem =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromOrder = (itemId: string) => {
    setOrderItems(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.id !== itemId);
    });
  };

  const getItemName = (item: MenuItem) => {
    return i18n.language === 'am' ? item.nameAm : item.name;
  };

  const getItemDescription = (item: MenuItem) => {
    return i18n.language === 'am' ? item.descriptionAm : item.description;
  };

  const getCategoryName = (category: typeof categories[0]) => {
    return i18n.language === 'am' ? category.nameAm : category.name;
  };

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15; // 15% tax
  const total = subtotal + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Menu Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* Search and Categories */}
        <div className={`p-6 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg`}>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder={t('common.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-${currentTheme.accent} focus:border-transparent transition-all duration-200 ${
                    mode === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg`
                    : mode === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getCategoryName(category)}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <img
                src={item.image}
                alt={getItemName(item)}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 className={`font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>
                {getItemName(item)}
              </h3>
              <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3 line-clamp-2`}>
                {getItemDescription(item)}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-bold text-${currentTheme.accent}`}>
                  {item.price} ETB
                </span>
                <button
                  onClick={() => addToOrder(item)}
                  className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-md transition-all duration-200 hover:scale-105`}
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('order.addToOrder')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="space-y-6">
        <div className={`p-6 ${mode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg`}>
          <h2 className={`text-xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
            <ShoppingCart className="w-6 h-6 mr-2" />
            {t('order.orderSummary')}
          </h2>

          {orderItems.length === 0 ? (
            <p className={`text-center ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'} py-8`}>
              No items in order
            </p>
          ) : (
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div key={item.id} className={`flex items-center justify-between p-3 ${mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <div className="flex-1">
                    <h4 className={`font-medium ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {getItemName(item)}
                    </h4>
                    <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.price} ETB × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => removeFromOrder(item.id)}
                      className={`p-1 rounded-lg ${mode === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className={`w-8 text-center ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToOrder(item)}
                      className={`p-1 rounded-lg ${mode === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition-colors`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {orderItems.length > 0 && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-600 mt-4 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{t('order.subtotal')}:</span>
                  <span className={mode === 'dark' ? 'text-white' : 'text-gray-900'}>{subtotal.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className={mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{t('order.tax')} (15%):</span>
                  <span className={mode === 'dark' ? 'text-white' : 'text-gray-900'}>{tax.toFixed(2)} ETB</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-600 pt-2">
                  <span className={mode === 'dark' ? 'text-white' : 'text-gray-900'}>{t('order.total')}:</span>
                  <span className={`text-${currentTheme.accent}`}>{total.toFixed(2)} ETB</span>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <button className={`w-full py-3 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2`}>
                  <CreditCard className="w-5 h-5" />
                  <span>{t('order.processPayment')}</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className={`py-2 px-3 border-2 border-dashed rounded-lg transition-colors ${mode === 'dark' ? 'border-gray-600 hover:border-gray-500 text-gray-300' : 'border-gray-300 hover:border-gray-400 text-gray-600'} flex items-center justify-center space-x-2`}>
                    <Receipt className="w-4 h-4" />
                    <span className="text-sm">{t('order.printReceipt')}</span>
                  </button>
                  <button className={`py-2 px-3 border-2 border-dashed rounded-lg transition-colors ${mode === 'dark' ? 'border-gray-600 hover:border-gray-500 text-gray-300' : 'border-gray-300 hover:border-gray-400 text-gray-600'} flex items-center justify-center space-x-2`}>
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">{t('order.cash')}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default orderSystem;