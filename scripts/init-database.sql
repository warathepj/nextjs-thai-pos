-- สร้างฐานข้อมูลสำหรับระบบ POS ร้านไก่ทอดไทย

-- ตารางเมนูอาหาร
CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ตารางออเดอร์
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ตารางรายการสินค้าในออเดอร์
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    menu_item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- ตารางการชำระเงิน
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    change_amount DECIMAL(10,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- เพิ่มข้อมูลเมนูเริ่มต้น
INSERT INTO menu_items (name, price, category, image_url) VALUES
('อกไก่ทอด', 30.00, 'ไก่ทอด', '/placeholder.svg?height=150&width=150'),
('น่องไก่ทอด', 20.00, 'ไก่ทอด', '/placeholder.svg?height=150&width=150'),
('ปีกไก่ทอด', 20.00, 'ไก่ทอด', '/placeholder.svg?height=150&width=150'),
('ข้าวเหนียว', 10.00, 'ข้าวและของหวาน', '/placeholder.svg?height=150&width=150'),
('น้ำพริกหนุ่ม', 10.00, 'เครื่องเคียง', '/placeholder.svg?height=150&width=150');
