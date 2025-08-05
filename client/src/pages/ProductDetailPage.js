import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ExternalLink, Star, TrendingUp, Store, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { productsAPI, affiliateAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();

  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    () => productsAPI.getById(id),
    {
      enabled: !!id,
    }
  );

  const handleAffiliateClick = async (storeId, storeName) => {
    try {
      const response = await affiliateAPI.redirect(id, storeId);
      
      if (response.data.success) {
        window.open(response.data.redirect_url, '_blank');
        toast.success(`${storeName} sitesine yönlendiriliyorsunuz...`);
      }
    } catch (error) {
      console.error('Affiliate redirect error:', error);
      toast.error('Yönlendirme hatası oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Ürün yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h2>
          <p className="text-gray-600">Aradığınız ürün bulunamadı veya kaldırılmış olabilir.</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const lowestPrice = product.prices?.[0];
  const highestPrice = product.prices?.[product.prices.length - 1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ürün Görseli */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                📦
              </div>
            )}
          </div>
        </div>

        {/* Ürün Bilgileri */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.brand && (
              <p className="text-lg text-gray-600 mb-2">Marka: {product.brand}</p>
            )}
            {product.category && (
              <span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
                {product.category}
              </span>
            )}
          </div>

          {/* Fiyat Bilgileri */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fiyat Bilgileri</h3>
            
            {lowestPrice && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">En Düşük Fiyat:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₺{lowestPrice.price.toLocaleString()}
                  </span>
                </div>
                
                {highestPrice && highestPrice.price !== lowestPrice.price && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">En Yüksek Fiyat:</span>
                    <span className="text-lg font-semibold text-red-600">
                      ₺{highestPrice.price.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Mağaza Sayısı:</span>
                  <span className="font-semibold text-gray-900">
                    {product.prices?.length || 0} mağaza
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Ürün Açıklaması */}
          {product.description && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ürün Açıklaması</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mağaza Fiyatları */}
      {product.prices && product.prices.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mağaza Fiyatları</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.prices.map((price, index) => (
              <motion.div
                key={index}
                className="card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {price.store_logo && (
                      <img
                        src={price.store_logo}
                        alt={price.store_name}
                        className="w-8 h-8 rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">{price.store_name}</h4>
                      {price.affiliate_program && (
                        <span className="affiliate-badge">Affiliate</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Fiyat:</span>
                    <span className="text-xl font-bold text-green-600">
                      ₺{price.price.toLocaleString()}
                    </span>
                  </div>

                  {price.original_price && price.original_price > price.price && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">İndirim:</span>
                      <span className="text-sm text-red-600">
                        %{Math.round(((price.original_price - price.price) / price.original_price) * 100)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Stok Durumu:</span>
                    <span className={price.in_stock ? 'text-green-600' : 'text-red-600'}>
                      {price.in_stock ? 'Mevcut' : 'Tükendi'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Güncelleme:</span>
                    <span>{new Date(price.last_updated).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => handleAffiliateClick(price.store_id, price.store_name)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Mağazaya Git</span>
                  </button>
                  
                  {price.affiliate_program && (
                    <p className="text-xs text-gray-500 text-center">
                      Bu link üzerinden alışveriş yaparak bize destek olabilirsiniz
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Fiyat Geçmişi */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Fiyat Geçmişi</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center space-x-2 text-gray-600 mb-4">
            <TrendingUp className="w-5 h-5" />
            <span>Son 30 günlük fiyat değişimi</span>
          </div>
          <div className="h-32 bg-white rounded border flex items-center justify-center text-gray-500">
            Fiyat grafiği burada gösterilecek
          </div>
        </div>
      </div>

      {/* Benzer Ürünler */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Benzer Ürünler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Benzer ürünler burada gösterilecek */}
          <div className="card p-4 text-center">
            <div className="text-gray-400 text-sm">Benzer ürünler yakında eklenecek</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;