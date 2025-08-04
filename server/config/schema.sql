-- Create database schema for price comparison app

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    affiliate_program BOOLEAN DEFAULT false,
    affiliate_commission DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    brand VARCHAR(255),
    model VARCHAR(255),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product prices table (stores the prices for each product at each store)
CREATE TABLE IF NOT EXISTS product_prices (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'TRY',
    affiliate_url TEXT,
    product_url TEXT NOT NULL,
    in_stock BOOLEAN DEFAULT true,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, store_id)
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    region VARCHAR(255),
    country VARCHAR(255) DEFAULT 'Turkey',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    preferred_location_id INTEGER REFERENCES locations(id),
    preferred_stores INTEGER[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search history table
CREATE TABLE IF NOT EXISTS search_history (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    query VARCHAR(500) NOT NULL,
    location_id INTEGER REFERENCES locations(id),
    results_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affiliate clicks tracking
CREATE TABLE IF NOT EXISTS affiliate_clicks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    product_id INTEGER REFERENCES products(id),
    store_id INTEGER REFERENCES stores(id),
    affiliate_url TEXT,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_prices_product_id ON product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_store_id ON product_prices(store_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_price ON product_prices(price);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at);

-- Insert sample data
INSERT INTO stores (name, domain, logo_url, affiliate_program, affiliate_commission) VALUES
('Trendyol', 'trendyol.com', 'https://cdn.dsmcdn.com/ty1/logo.svg', true, 5.00),
('Hepsiburada', 'hepsiburada.com', 'https://www.hepsiburada.com/static/images/logo.svg', true, 4.50),
('Amazon TR', 'amazon.com.tr', 'https://images-na.ssl-images-amazon.com/images/G/01/gc/designs/livepreview/amazon_dkblue_noto_email_v2016_us-main._CB468775337_.png', true, 6.00),
('N11', 'n11.com', 'https://www.n11.com/static/images/logo.svg', true, 4.00),
('GittiGidiyor', 'gittigidiyor.com', 'https://www.gittigidiyor.com/static/images/logo.svg', true, 3.50)
ON CONFLICT (domain) DO NOTHING;

INSERT INTO locations (city, region) VALUES
('Istanbul', 'Marmara'),
('Ankara', 'Central Anatolia'),
('Izmir', 'Aegean'),
('Bursa', 'Marmara'),
('Antalya', 'Mediterranean')
ON CONFLICT DO NOTHING;