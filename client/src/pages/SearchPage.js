import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Search, Filter, SortAsc, SortDesc, ExternalLink, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { searchAPI } from '../services/api';
import toast from 'react-hot-toast';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'price_asc');
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get('q') || '';
  const locationParam = searchParams.get('location') || '';
  const sortParam = searchParams.get('sort') || 'price_asc';

  const { data: searchResults, isLoading, error } = useQuery(
    ['search', query, locationParam, sortParam],
    () => searchAPI.search(query, locationParam, sortParam),
    {
      enabled: !!query,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({
        q: searchQuery.trim(),
        location: location,
        sort: sortBy,
      });
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setSearchParams({
      q: query,
      location: locationParam,
      sort: newSort,
    });
  };

  const handleAffiliateClick = async (productId, storeId, storeName) => {
    try {
      const response = await fetch(`/api/affiliate/redirect/${productId}/${storeId}`);
      const data = await response.json();
      
      if (data.success) {
        window.open(data.redirect_url, '_blank');
        toast.success(`${storeName} sitesine yönlendiriliyorsunuz...`);
      }
    } catch (error) {
      console.error('Affiliate redirect error:', error);
      toast.error('Yönlendirme hatası oluştu');
    }
  };

  const sortOptions = [
    { value: 'price_asc', label: 'Fiyat (Düşükten Yükseğe)', icon: <SortAsc className="w-4 h-4" /> },
    { value: 'price_desc', label: 'Fiyat (Yüksekten Düşüğe)', icon: <SortDesc className="w-4 h-4" /> },
    { value: 'name_asc', label: 'İsim (A-Z)', icon: <SortAsc className="w-4 h-4" /> },
    { value: 'name_desc', label: 'İsim (Z-A)', icon: <SortDesc className="w-4 h-4" /> },
  ];

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Arama Hatası</h2>
          <p className="text-gray-600">Arama sırasında bir hata oluştu. Lütfen tekrar deneyin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Form */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tüm Lokasyonlar</option>
              <option value="İstanbul">İstanbul</option>
              <option value="Ankara">Ankara</option>
              <option value="İzmir">İzmir</option>
              <option value="Bursa">Bursa</option>
              <option value="Antalya">Antalya</option>
            </select>
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Ara
            </button>
          </div>
        </form>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Filter className="w-4 h-4" />
            Filtreler
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sırala:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {searchResults && (
          <div className="text-sm text-gray-600">
            {searchResults.total_results} sonuç bulundu
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Aranıyor...</p>
        </div>
      ) : searchResults && searchResults.products ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.products.map((product, index) => (
            <motion.div
              key={product.id}
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-gray-400 text-4xl">📦</div>
                )}
              </div>

              {/* Product Info */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                {product.brand && (
                  <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
                )}
                {product.category && (
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mb-2">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Fiyat Aralığı:</span>
                  <span className="text-lg font-bold text-green-600">
                    ₺{product.min_price?.toLocaleString()}
                  </span>
                </div>
                {product.max_price && product.max_price !== product.min_price && (
                  <p className="text-sm text-gray-500">
                    - ₺{product.max_price.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Store Count */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  {product.store_count} mağazada mevcut
                </span>
                <Link
                  to={`/product/${product.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Detayları Gör
                </Link>
              </div>

              {/* Store Prices */}
              {product.prices && product.prices.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Mağaza Fiyatları:</h4>
                  {product.prices.slice(0, 3).map((price, priceIndex) => (
                    <div
                      key={priceIndex}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        {price.store_logo && (
                          <img
                            src={price.store_logo}
                            alt={price.store_name}
                            className="w-4 h-4"
                          />
                        )}
                        <span className="text-sm font-medium">{price.store_name}</span>
                        {price.affiliate_program && (
                          <span className="affiliate-badge">Affiliate</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-600">
                          ₺{price.price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleAffiliateClick(product.id, price.store_id, price.store_name)}
                          className="text-primary-600 hover:text-primary-700"
                          title="Mağazaya git"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {product.prices.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{product.prices.length - 3} mağaza daha
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Aradığınız kriterlere uygun ürün bulunamadı.</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Arama Yapın</h3>
          <p className="text-gray-600">Ürün aramak için yukarıdaki arama kutusunu kullanın.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;