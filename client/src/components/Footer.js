import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Ürün Ara', href: '/search' },
    { name: 'Mağazalar', href: '/stores' },
    { name: 'Affiliate', href: '/affiliate' },
  ];

  const categories = [
    { name: 'Elektronik', href: '/search?category=elektronik' },
    { name: 'Giyim', href: '/search?category=giyim' },
    { name: 'Ev & Yaşam', href: '/search?category=ev-yasam' },
    { name: 'Spor', href: '/search?category=spor' },
    { name: 'Kitap', href: '/search?category=kitap' },
    { name: 'Oyuncak', href: '/search?category=oyuncak' },
  ];

  const stores = [
    { name: 'Trendyol', href: '/stores/1' },
    { name: 'Hepsiburada', href: '/stores/2' },
    { name: 'Amazon TR', href: '/stores/3' },
    { name: 'N11', href: '/stores/4' },
    { name: 'GittiGidiyor', href: '/stores/5' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <Facebook className="w-5 h-5" />, href: '#' },
    { name: 'Twitter', icon: <Twitter className="w-5 h-5" />, href: '#' },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5" />, href: '#' },
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FiyatKarşılaştır</span>
            </div>
            <p className="text-gray-400 mb-4">
              Türkiye'nin en büyük e-ticaret sitelerinden milyonlarca ürünü karşılaştırın, 
              en uygun fiyatı bulun ve affiliate linklerle kazanç sağlayın.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    to={category.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mağazalar */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Mağazalar</h3>
            <ul className="space-y-2">
              {stores.map((store) => (
                <li key={store.name}>
                  <Link
                    to={store.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {store.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* İletişim Bilgileri */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary-400" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">info@fiyatkarsilastir.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary-400" />
              <div>
                <p className="text-sm text-gray-400">Telefon</p>
                <p className="text-white">+90 (212) 555 0123</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary-400" />
              <div>
                <p className="text-sm text-gray-400">Adres</p>
                <p className="text-white">İstanbul, Türkiye</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} FiyatKarşılaştır. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Gizlilik Politikası
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Kullanım Şartları
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Çerez Politikası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;