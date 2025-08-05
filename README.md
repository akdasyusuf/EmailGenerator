# FiyatKarşılaştır - Akakce.com Tarzı Fiyat Karşılaştırma Platformu

Türkiye'nin en büyük e-ticaret sitelerinden milyonlarca ürünü karşılaştıran, en uygun fiyatı bulan ve affiliate linklerle kazanç sağlayan modern web uygulaması.

## 🚀 Özellikler

### 🔍 Akıllı Arama
- Milyonlarca ürün arasından anında arama
- Fiyat karşılaştırması
- Lokasyon bazlı arama
- Popüler aramalar önerisi

### 🏪 Mağaza Entegrasyonu
- **Trendyol** - %5 affiliate komisyonu
- **Hepsiburada** - %4.5 affiliate komisyonu  
- **Amazon TR** - %6 affiliate komisyonu
- **N11** - %4 affiliate komisyonu
- **GittiGidiyor** - %3.5 affiliate komisyonu
- Ve daha fazlası...

### 💰 Affiliate Marketing
- Otomatik affiliate link yönetimi
- Tıklama takibi ve istatistikler
- Kazanç raporları
- Top performing ürünler

### 📊 Fiyat Takibi
- Anlık fiyat güncellemeleri
- Fiyat değişiklik alarmları
- Geçmiş fiyat grafikleri
- En uygun fiyat önerileri

## 🛠️ Teknoloji Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **PostgreSQL** - Veritabanı
- **Puppeteer** - Web scraping
- **Cheerio** - HTML parsing
- **Axios** - HTTP client

### Frontend
- **React 18** - UI framework
- **React Query** - Data fetching
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### DevOps
- **Docker** - Containerization
- **PM2** - Process management
- **Nginx** - Reverse proxy

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL 14+
- npm veya yarn

### 1. Repository'yi klonlayın
```bash
git clone https://github.com/yourusername/price-comparison-app.git
cd price-comparison-app
```

### 2. Bağımlılıkları yükleyin
```bash
npm run install-all
```

### 3. Veritabanını kurun
```bash
# PostgreSQL'e bağlanın
psql -U postgres

# Veritabanını oluşturun
CREATE DATABASE price_comparison;

# Şemayı yükleyin
\c price_comparison
\i server/config/schema.sql
```

### 4. Environment değişkenlerini ayarlayın
```bash
# server/.env dosyası oluşturun
cp server/.env.example server/.env

# Gerekli değişkenleri düzenleyin
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_NAME=price_comparison
DB_PORT=5432
```

### 5. Uygulamayı başlatın
```bash
# Development modunda
npm run dev

# Production modunda
npm run build
npm start
```

## 🚀 Kullanım

### Arama Yapma
1. Ana sayfada arama kutusuna ürün adını yazın
2. Lokasyon seçin (opsiyonel)
3. Sonuçları fiyat, isim veya popülerliğe göre sıralayın
4. En uygun fiyatlı ürünü seçin

### Affiliate Link Kullanımı
1. Ürün detay sayfasına gidin
2. Mağaza fiyatlarını karşılaştırın
3. "Mağazaya Git" butonuna tıklayın
4. Affiliate linki ile yönlendirilirsiniz

### Kazanç Takibi
1. Affiliate sayfasına gidin
2. Tıklama istatistiklerini görün
3. Kazanç raporlarını inceleyin
4. Top performing ürünleri analiz edin

## 📊 API Endpoints

### Arama
- `GET /api/search` - Ürün arama
- `GET /api/search/suggestions` - Arama önerileri
- `GET /api/search/popular` - Popüler aramalar

### Ürünler
- `GET /api/products` - Tüm ürünler
- `GET /api/products/:id` - Ürün detayı
- `GET /api/products/categories/list` - Kategoriler
- `GET /api/products/brands/list` - Markalar

### Mağazalar
- `GET /api/stores` - Tüm mağazalar
- `GET /api/stores/:id` - Mağaza detayı
- `GET /api/stores/:id/stats` - Mağaza istatistikleri

### Affiliate
- `GET /api/affiliate/redirect/:productId/:storeId` - Yönlendirme
- `GET /api/affiliate/stats` - Affiliate istatistikleri
- `GET /api/affiliate/top-products` - Top ürünler
- `PUT /api/affiliate/update-urls` - URL güncelleme

### Lokasyon
- `GET /api/location` - Tüm lokasyonlar
- `GET /api/location/:id` - Lokasyon detayı
- `GET /api/location/search/:query` - Lokasyon arama

## 💡 Ekstra Kazanç Yöntemleri

### 1. Affiliate Programları
- **Amazon Associates** - %1-10 komisyon
- **Trendyol Partner** - %5-15 komisyon
- **Hepsiburada Affiliate** - %4-12 komisyon
- **N11 Partner** - %3-10 komisyon

### 2. Reklam Gelirleri
- Google AdSense entegrasyonu
- Banner reklamları
- Sponsored ürünler
- Native advertising

### 3. Premium Özellikler
- Fiyat alarmları
- Detaylı analitikler
- API erişimi
- Özel raporlar

### 4. Mobil Uygulama
- iOS ve Android uygulamaları
- Push notification'lar
- Offline kullanım
- Barcode scanner

## 🔧 Geliştirme

### Web Scraping
```javascript
// Yeni mağaza ekleme
const newStore = {
  name: 'Yeni Mağaza',
  domain: 'yenimagaza.com',
  searchUrl: 'https://yenimagaza.com/search?q={query}',
  productSelector: '.product-item',
  priceSelector: '.price'
};
```

### Affiliate Link Yönetimi
```javascript
// Affiliate link oluşturma
const affiliateUrl = `https://store.com/product?ref=your_id&utm_source=pricecomparison`;
```

### Veritabanı Şeması
```sql
-- Yeni tablo ekleme
CREATE TABLE new_table (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Deployment

### Docker ile
```bash
# Docker image oluşturun
docker build -t price-comparison-app .

# Container'ı çalıştırın
docker run -p 3000:3000 -p 5000:5000 price-comparison-app
```

### PM2 ile
```bash
# PM2 ile başlatın
pm2 start ecosystem.config.js

# Logları görün
pm2 logs

# Restart
pm2 restart all
```

## 📈 Performans Optimizasyonu

### Backend
- Redis cache entegrasyonu
- Database indexing
- Query optimization
- Rate limiting

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- CDN kullanımı

## 🔒 Güvenlik

- HTTPS zorunluluğu
- Rate limiting
- Input validation
- SQL injection koruması
- XSS koruması
- CORS yapılandırması

## 📝 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **Email**: info@fiyatkarsilastir.com
- **Website**: https://fiyatkarsilastir.com
- **Twitter**: @fiyatkarsilastir

## 🙏 Teşekkürler

Bu proje aşağıdaki açık kaynak projelerin kullanımı ile mümkün olmuştur:

- [React](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Puppeteer](https://pptr.dev/)
- [PostgreSQL](https://www.postgresql.org/)

---

**FiyatKarşılaştır** - En uygun fiyatı bulun, affiliate linklerle kazanç sağlayın! 🚀