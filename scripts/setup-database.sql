-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  banner_name VARCHAR(100) NOT NULL,
  banner_image VARCHAR(255) NOT NULL,
  description TEXT
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  service_code VARCHAR(50) PRIMARY KEY,
  service_name VARCHAR(100) NOT NULL,
  service_icon VARCHAR(255) NOT NULL,
  service_tariff INT NOT NULL
);

-- Balances table
CREATE TABLE IF NOT EXISTS balances (
  user_id INT PRIMARY KEY REFERENCES users(id),
  balance BIGINT NOT NULL DEFAULT 0
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  invoice_number VARCHAR(50) NOT NULL,
  service_code VARCHAR(50),
  transaction_type VARCHAR(20) NOT NULL, -- TOPUP or PAYMENT
  description VARCHAR(255),
  total_amount BIGINT NOT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample banners
INSERT INTO banners (banner_name, banner_image, description) VALUES
('Banner Promo 1', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop', 'Promo spesial bulan ini'),
('Banner Cashback', 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=200&fit=crop', 'Cashback hingga 50%'),
('Banner Gratis Admin', 'https://images.unsplash.com/photo-1556740714-f6d511d2c4d0?w=400&h=200&fit=crop', 'Gratis biaya admin')
ON CONFLICT DO NOTHING;

-- Insert sample services
INSERT INTO services (service_code, service_name, service_icon, service_tariff) VALUES
('PAJAK', 'Pajak PBB', 'https://img.icons8.com/color/48/tax.png', 40000),
('PLN', 'Listrik', 'https://img.icons8.com/color/48/electricity.png', 10000),
('PDAM', 'PDAM Berlangganan', 'https://img.icons8.com/color/48/water.png', 40000),
('PULSA', 'Pulsa', 'https://img.icons8.com/color/48/phone.png', 40000),
('PGN', 'PGN Berlangganan', 'https://img.icons8.com/color/48/gas.png', 50000),
('MUSIK', 'Musik Berlangganan', 'https://img.icons8.com/color/48/music.png', 50000),
('TV', 'TV Berlangganan', 'https://img.icons8.com/color/48/tv.png', 50000),
('PAKET_DATA', 'Paket Data', 'https://img.icons8.com/color/48/data.png', 50000),
('VOUCHER_GAME', 'Voucher Game', 'https://img.icons8.com/color/48/game-controller.png', 100000),
('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://img.icons8.com/color/48/food.png', 100000),
('QURBAN', 'Qurban', 'https://img.icons8.com/color/48/mosque.png', 200000),
('ZAKAT', 'Zakat', 'https://img.icons8.com/color/48/charity.png', 300000)
