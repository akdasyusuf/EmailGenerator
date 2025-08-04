import React from 'react';
import { useQuery } from 'react-query';
import { ExternalLink, TrendingUp, Users, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { storesAPI } from '../services/api';

const StoresPage = () => {
  const { data: stores, isLoading, error } = useQuery(
    'stores',
    () => storesAPI.getAll(),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Mağazalar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yükleme Hatası</h2>
          <p className="text-gray-600">Mağaza bilgileri yüklenirken bir hata oluştu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Partner Mağazalarımız
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Türkiye'nin en büyük e-ticaret siteleri ile çalışıyoruz. 
          Her mağazadan en uygun fiyatları bulun ve affiliate linklerle kazanç sağlayın.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Package className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stores?.stores?.length || 0}
          </div>
          <div className="text-gray-600">Partner Mağaza</div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">1M+</div>
          <div className="text-gray-600">Ürün</div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">100K+</div>
          <div className="text-gray-600">Kullanıcı</div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ExternalLink className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">₺5M+</div>
          <div className="text-gray-600">Tasarruf</div>
        </motion.div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores?.stores?.map((store, index) => (
          <motion.div
            key={store.id}
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {/* Store Header */}
            <div className="flex items-center space-x-4 mb-4">
              {store.logo_url && (
                <img
                  src={store.logo_url}
                  alt={store.name}
                  className="w-12 h-12 rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                <p className="text-sm text-gray-600">{store.domain}</p>
              </div>
              {store.affiliate_program && (
                <span className="affiliate-badge">Affiliate</span>
              )}
            </div>

            {/* Store Stats */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Affiliate Komisyonu:</span>
                <span className="font-semibold text-green-600">
                  %{store.affiliate_commission}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Program Durumu:</span>
                <span className={`text-sm font-medium ${
                  store.affiliate_program ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {store.affiliate_program ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>

            {/* Store Actions */}
            <div className="space-y-2">
              <a
                href={`https://${store.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Mağazaya Git</span>
              </a>
              
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200">
                Detayları Gör
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Affiliate Program Info */}
      <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Affiliate Programımıza Katılın
          </h2>
          <p className="text-xl mb-6 text-primary-100 max-w-2xl mx-auto">
            Mağaza sahibi misiniz? Affiliate programımıza katılarak ekstra gelir elde edin. 
            Milyonlarca kullanıcıya ulaşın ve satışlarınızı artırın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Başvuru Yap
            </button>
            <button className="border border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Daha Fazla Bilgi
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Sık Sorulan Sorular
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Affiliate programı nasıl çalışır?
            </h3>
            <p className="text-gray-600">
              Kullanıcılar sitemiz üzerinden mağazalara yönlendirilir ve satış gerçekleştiğinde 
              komisyon kazanırız. Bu komisyonu kullanıcılarla paylaşırız.
            </p>
          </div>
          
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Hangi mağazalar ile çalışıyorsunuz?
            </h3>
            <p className="text-gray-600">
              Türkiye'nin en büyük e-ticaret siteleri ile çalışıyoruz: Trendyol, Hepsiburada, 
              Amazon TR, N11, GittiGidiyor ve daha fazlası.
            </p>
          </div>
          
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Fiyatlar ne sıklıkla güncellenir?
            </h3>
            <p className="text-gray-600">
              Fiyatlar günde birkaç kez otomatik olarak güncellenir. Önemli fiyat değişiklikleri 
              anında bildirim olarak gönderilir.
            </p>
          </div>
          
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              Mağaza eklemek istiyorum, nasıl yapabilirim?
            </h3>
            <p className="text-gray-600">
              Mağazanızı eklemek için bizimle iletişime geçin. Affiliate programı şartlarını 
              değerlendirip size geri dönüş yaparız.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoresPage;