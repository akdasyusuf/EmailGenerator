#!/bin/bash

echo "🚀 FiyatKarşılaştır uygulaması başlatılıyor..."

# PostgreSQL kontrolü
echo "📊 PostgreSQL kontrol ediliyor..."
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL yüklü değil. Lütfen PostgreSQL'i yükleyin."
    exit 1
fi

# Node.js kontrolü
echo "📦 Node.js kontrol ediliyor..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js yüklü değil. Lütfen Node.js'i yükleyin."
    exit 1
fi

# npm kontrolü
echo "📦 npm kontrol ediliyor..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm yüklü değil. Lütfen npm'i yükleyin."
    exit 1
fi

# Bağımlılıkları yükle
echo "📦 Bağımlılıklar yükleniyor..."
npm run install-all

# Environment dosyasını kopyala
echo "⚙️ Environment dosyası hazırlanıyor..."
if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    echo "⚠️ Lütfen server/.env dosyasını düzenleyin!"
fi

# Veritabanını kontrol et
echo "🗄️ Veritabanı kontrol ediliyor..."
if ! psql -U postgres -d price_comparison -c "SELECT 1;" &> /dev/null; then
    echo "⚠️ Veritabanı bağlantısı başarısız. Lütfen PostgreSQL'i başlatın ve veritabanını oluşturun."
    echo "📝 Veritabanı oluşturma komutları:"
    echo "   psql -U postgres"
    echo "   CREATE DATABASE price_comparison;"
    echo "   \\c price_comparison"
    echo "   \\i server/config/schema.sql"
fi

# Uygulamayı başlat
echo "🚀 Uygulama başlatılıyor..."
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo "📊 API Health: http://localhost:5000/api/health"

npm run dev