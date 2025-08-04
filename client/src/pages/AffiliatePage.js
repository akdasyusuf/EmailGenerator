import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { TrendingUp, DollarSign, Users, ExternalLink, Calendar, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { affiliateAPI } from '../services/api';

const AffiliatePage = () => {
  const [timeRange, setTimeRange] = useState(30);

  const { data: stats, isLoading: statsLoading } = useQuery(
    ['affiliate-stats', timeRange],
    () => affiliateAPI.getStats(timeRange),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const { data: topProducts, isLoading: productsLoading } = useQuery(
    ['affiliate-top-products', timeRange],
    () => affiliateAPI.getTopProducts(timeRange),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const timeRangeOptions = [
    { value: 7, label: 'Son 7 Gün' },
    { value: 30, label: 'Son 30 Gün' },
    { value: 90, label: 'Son 90 Gün' },
  ];

  if (statsLoading || productsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Affiliate istatistikleri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Affiliate Programı
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Partner mağazalarımızla çalışarak kazanç sağlayın. 
          Her tıklama ve satış size gelir getirir.
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                timeRange === option.value
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ExternalLink className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Tıklama</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.total_clicks?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Kazanç</p>
              <p className="text-2xl font-bold text-gray-900">
                ₺{stats?.total_earnings?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Benzersiz Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.store_stats?.reduce((sum, stat) => sum + parseInt(stat.unique_users || 0), 0).toLocaleString() || 0}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ortalama Komisyon</p>
              <p className="text-2xl font-bold text-gray-900">
                %{stats?.store_stats?.length > 0 
                  ? (stats.store_stats.reduce((sum, stat) => sum + parseFloat(stat.affiliate_commission || 0), 0) / stats.store_stats.length).toFixed(1)
                  : 0}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Store Performance */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mağaza Performansı</h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mağaza
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tıklama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Benzersiz Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Komisyon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tahmini Kazanç
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats?.store_stats?.map((store, index) => (
                  <motion.tr
                    key={store.store_name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {store.store_name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {store.store_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {store.store_domain}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseInt(store.total_clicks).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseInt(store.unique_users).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      %{store.affiliate_commission}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ₺{parseFloat(store.estimated_earnings).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">En Popüler Ürünler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProducts?.top_products?.slice(0, 6).map((product, index) => (
            <motion.div
              key={index}
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {product.product_name}
                </h3>
                <span className="text-sm text-gray-500">{product.brand}</span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mağaza:</span>
                  <span className="text-sm font-medium">{product.store_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fiyat:</span>
                  <span className="font-semibold text-green-600">
                    ₺{product.price?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tıklama:</span>
                  <span className="text-sm font-medium">{product.click_count}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Komisyon: %{product.affiliate_commission}</span>
                <span>Kategori: {product.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-lg mb-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Nasıl Çalışır?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Ürün Ara</h3>
              <p className="text-primary-100">
                Aradığınız ürünü sitemizde arayın ve en uygun fiyatları görün
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Mağazaya Git</h3>
              <p className="text-primary-100">
                Affiliate linkimiz üzerinden mağazaya yönlendirilirsiniz
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Kazanç Sağla</h3>
              <p className="text-primary-100">
                Satış gerçekleştiğinde hem siz hem de biz kazanç sağlarız
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Hemen Başlayın
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Affiliate programımıza katılarak ekstra gelir elde edin. 
          Her tıklama ve satış size kazanç getirir.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            Ürün Ara
          </button>
          <button className="border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            Daha Fazla Bilgi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AffiliatePage;