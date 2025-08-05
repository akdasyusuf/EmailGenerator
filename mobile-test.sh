#!/bin/bash

echo "📱 Mobil Test Başlatılıyor..."

# IP adresini al
IP_ADDRESS=$(hostname -I | awk '{print $1}')
echo "🌐 Yerel IP Adresi: $IP_ADDRESS"

# Portları kontrol et
FRONTEND_PORT=3000
BACKEND_PORT=5000

echo "🔍 Port kontrolü yapılıyor..."

# Frontend port kontrolü
if lsof -Pi :$FRONTEND_PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Frontend port $FRONTEND_PORT kullanımda"
else
    echo "❌ Frontend port $FRONTEND_PORT boş"
fi

# Backend port kontrolü
if lsof -Pi :$BACKEND_PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Backend port $BACKEND_PORT kullanımda"
else
    echo "❌ Backend port $BACKEND_PORT boş"
fi

echo ""
echo "📱 Mobil Test URL'leri:"
echo "Frontend: http://$IP_ADDRESS:$FRONTEND_PORT"
echo "Backend API: http://$IP_ADDRESS:$BACKEND_PORT"
echo "API Health: http://$IP_ADDRESS:$BACKEND_PORT/api/health"
echo ""
echo "📋 Mobil Test Adımları:"
echo "1. Mobil cihazınızı aynı WiFi ağına bağlayın"
echo "2. Mobil tarayıcınızda yukarıdaki URL'yi açın"
echo "3. Responsive tasarımı test edin"
echo "4. Touch gestures'ları test edin"
echo "5. Farklı ekran boyutlarını test edin"
echo ""
echo "🔧 Geliştirici Araçları:"
echo "- Chrome DevTools: F12 > Toggle device toolbar"
echo "- Firefox: F12 > Responsive Design Mode"
echo "- Safari: Develop > Enter Responsive Design Mode"
echo ""
echo "📊 Test Edilecek Özellikler:"
echo "✅ Responsive tasarım"
echo "✅ Touch navigation"
echo "✅ Search functionality"
echo "✅ Product comparison"
echo "✅ Affiliate links"
echo "✅ Mobile menu"
echo "✅ Loading states"
echo "✅ Error handling"

# QR kod oluştur (eğer qrencode yüklüyse)
if command -v qrencode &> /dev/null; then
    echo ""
    echo "📱 QR Kod (Frontend):"
    qrencode -t ansiutf8 "http://$IP_ADDRESS:$FRONTEND_PORT"
    echo ""
    echo "📱 QR Kod (Backend):"
    qrencode -t ansiutf8 "http://$IP_ADDRESS:$BACKEND_PORT/api/health"
fi

echo ""
echo "🚀 Uygulamayı başlatmak için:"
echo "npm run dev"