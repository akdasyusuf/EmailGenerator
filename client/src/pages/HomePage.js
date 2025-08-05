import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Store, Zap, Shield, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularSearches = [
    'iPhone 15',
    'Samsung Galaxy S24',
    'MacBook Pro',
    'PlayStation 5',
    'Nike Air Max',
    'Adidas Ultraboost'
  ];

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Akıllı Arama',
      description: 'Milyonlarca ürün arasından en uygun fiyatlı olanını bulun'
    },
    {
      icon: <Store className="w-6 h-6" />,
      title: 'Mağaza Karşılaştırma',
      description: 'Trendyol, Hepsiburada, Amazon ve daha fazlası'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Anlık Fiyat Takibi',
      description: 'Fiyat değişikliklerini anında öğrenin'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Güvenli Alışveriş',
      description: 'Affiliate linklerle güvenli ve karlı alışveriş'
    }
  ];

  const stats = [
    { number: '1M+', label: 'Ürün' },
    { number: '50+', label: 'Mağaza' },
    { number: '100K+', label: 'Kullanıcı' },
    { number: '₺5M+', label: 'Tasarruf' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              En Uygun Fiyatı
              <span className="block text-yellow-300">Hemen Bulun</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Türkiye'nin en büyük e-ticaret sitelerinden milyonlarca ürünü karşılaştırın, 
              en uygun fiyatı bulun ve affiliate linklerle kazanç sağlayın.
            </motion.p>

            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Ne arıyorsunuz?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 text-lg border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 text-gray-900"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Ara
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden FiyatKarşılaştır?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Akıllı arama teknolojimiz ve affiliate programlarımızla 
              hem tasarruf edin hem de kazanç sağlayın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Searches */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popüler Aramalar
            </h2>
            <p className="text-gray-600">
              En çok aranan ürünleri keşfedin
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularSearches.map((search, index) => (
              <motion.button
                key={index}
                onClick={() => navigate(`/search?q=${encodeURIComponent(search)}`)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {search}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Hemen Başlayın
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Milyonlarca ürün arasından en uygun fiyatlı olanını bulun ve 
            affiliate programlarımızla ekstra kazanç sağlayın.
          </p>
          <Link
            to="/search"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            <Search className="w-5 h-5 mr-2" />
            Ürün Ara
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;