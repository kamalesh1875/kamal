-- ==============================================================================
-- GOATFARM OS — ENTERPRISE MULTI-FARM POSTGRESQL SCHEMA
-- PostgreSQL 14+ / Supabase / Neon Compatible
-- ==============================================================================

-- 1. Organizations & Multi-Farm Hierarchy
CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(64) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farms (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(64) UNIQUE NOT NULL,
    location VARCHAR(255),
    phone VARCHAR(50),
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('OWNER', 'ADMIN', 'FARM_MANAGER', 'ACCOUNTANT', 'VETERINARIAN', 'WORKER', 'CASHIER')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Pens / Shed Facilities
CREATE TABLE IF NOT EXISTS pens (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL DEFAULT 30,
    current_count INT NOT NULL DEFAULT 0,
    category VARCHAR(50) NOT NULL DEFAULT 'GENERAL' CHECK (category IN ('WEANERS', 'FATTENING_BUCKS', 'DOES_BREEDING', 'QUARANTINE', 'GENERAL')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Living Goat Assets (Central Business Entity)
CREATE TABLE IF NOT EXISTS goats (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    pen_id VARCHAR(64) REFERENCES pens(id) ON DELETE SET NULL,
    internal_id VARCHAR(64),
    tag_number VARCHAR(64) NOT NULL,
    rfid_tag VARCHAR(100),
    qr_code VARCHAR(255),
    photo_url TEXT,
    breed VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    birth_date DATE,
    is_estimated_dob BOOLEAN DEFAULT FALSE,
    age_months INT DEFAULT 6,
    purchase_date DATE NOT NULL,
    source_supplier VARCHAR(255),
    purchase_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SOLD', 'DEAD', 'TRANSFERRED', 'QUARANTINED', 'PREGNANT')),
    batch VARCHAR(64),
    purpose VARCHAR(50) DEFAULT 'fattening' CHECK (purpose IN ('fattening', 'breeding', 'sale', 'dairy')),
    color VARCHAR(100),
    markings TEXT,
    notes TEXT,
    
    -- Weight metrics
    initial_weight_kg NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    current_weight_kg NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    target_weight_kg NUMERIC(6, 2) DEFAULT 35.00,
    adg_grams INT DEFAULT 0,
    last_weighed_date DATE,
    
    -- Economics & True Cost Engine
    market_rate_per_kg NUMERIC(8, 2) DEFAULT 460.00,
    accumulated_feed_cost NUMERIC(12, 2) DEFAULT 0.00,
    accumulated_medicine_cost NUMERIC(12, 2) DEFAULT 0.00,
    accumulated_labor_cost NUMERIC(12, 2) DEFAULT 0.00,
    accumulated_overhead_cost NUMERIC(12, 2) DEFAULT 0.00,
    true_cost NUMERIC(12, 2) DEFAULT 0.00,
    estimated_market_value NUMERIC(12, 2) DEFAULT 0.00,
    projected_profit NUMERIC(12, 2) DEFAULT 0.00,
    
    -- Pedigree
    dam_tag VARCHAR(64),
    sire_tag VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_goat_tag_farm UNIQUE (farm_id, tag_number)
);

-- 5. Weight Checkpoints & ADG Log
CREATE TABLE IF NOT EXISTS weight_records (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    goat_id VARCHAR(64) REFERENCES goats(id) ON DELETE CASCADE,
    weight_kg NUMERIC(6, 2) NOT NULL,
    recorded_at DATE NOT NULL,
    adg_grams INT DEFAULT 0,
    measurement_method VARCHAR(50) DEFAULT 'SCALE_ELECTRONIC',
    worker_name VARCHAR(100),
    device_source VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Health & Veterinary Interventions
CREATE TABLE IF NOT EXISTS health_records (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    goat_id VARCHAR(64) REFERENCES goats(id) ON DELETE CASCADE,
    record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('VACCINATION', 'DEWORMING', 'TREATMENT', 'CHECKUP')),
    title VARCHAR(255) NOT NULL,
    medicine_name VARCHAR(255),
    dosage VARCHAR(100),
    cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    administered_at DATE NOT NULL,
    vet_name VARCHAR(255) NOT NULL,
    next_due_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Customers & Traders Credit Management
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    gst_number VARCHAR(50),
    credit_limit NUMERIC(12, 2) NOT NULL DEFAULT 50000.00,
    outstanding_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_purchases NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    payment_terms_days INT DEFAULT 15,
    status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'BLOCKED')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Sales Transactions (POS & Tax Invoices)
CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) NOT NULL,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE RESTRICT,
    customer_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    transport_charges NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL,
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    balance_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    due_date DATE,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('CASH', 'UPI', 'BANK_TRANSFER', 'CREDIT', 'SPLIT')),
    payment_breakdown JSONB,
    payment_status VARCHAR(30) NOT NULL CHECK (payment_status IN ('PAID', 'PARTIAL', 'CREDIT', 'OVERDUE')),
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('COMPLETED', 'CANCELLED', 'VOIDED')),
    notes TEXT,
    created_by VARCHAR(100),
    cancelled_by VARCHAR(100),
    cancel_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_sale_invoice_farm UNIQUE (farm_id, invoice_number)
);

-- 9. Sale Line Items (Traceable Goats Sold)
CREATE TABLE IF NOT EXISTS sale_items (
    id VARCHAR(64) PRIMARY KEY,
    sale_id VARCHAR(64) REFERENCES sales(id) ON DELETE CASCADE,
    goat_id VARCHAR(64) REFERENCES goats(id) ON DELETE RESTRICT,
    tag_number VARCHAR(64) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    weight_kg NUMERIC(6, 2) NOT NULL,
    rate_per_kg NUMERIC(8, 2) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    true_cost_at_sale NUMERIC(12, 2) NOT NULL,
    profit_on_goat NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Financial Payments & Allocation
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE RESTRICT,
    receipt_number VARCHAR(100) NOT NULL,
    payment_date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE')),
    reference_notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_allocations (
    id VARCHAR(64) PRIMARY KEY,
    payment_id VARCHAR(64) REFERENCES payments(id) ON DELETE CASCADE,
    sale_id VARCHAR(64) REFERENCES sales(id) ON DELETE CASCADE,
    allocated_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Customer Transaction Ledger
CREATE TABLE IF NOT EXISTS customer_ledger (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('INVOICE', 'PAYMENT', 'RETURN', 'ADJUSTMENT')),
    reference_id VARCHAR(64),
    reference_no VARCHAR(100),
    debit NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    credit NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    running_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Feed & Pharmacy Inventory
CREATE TABLE IF NOT EXISTS inventory_items (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('FEED', 'MEDICINE', 'EQUIPMENT', 'MINERAL')),
    unit VARCHAR(30) NOT NULL,
    current_stock NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    minimum_stock_level NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    cost_per_unit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_stock_value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    supplier VARCHAR(255),
    last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock_movements (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    inventory_item_id VARCHAR(64) REFERENCES inventory_items(id) ON DELETE CASCADE,
    movement_type VARCHAR(50) NOT NULL CHECK (movement_type IN ('INWARD_PURCHASE', 'FEED_ISSUED', 'WASTAGE', 'ADJUSTMENT')),
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    cost_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    allocated_to_pen_id VARCHAR(64) REFERENCES pens(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Farm Operating Expenses
CREATE TABLE IF NOT EXISTS farm_expenses (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('FEED', 'VETERINARY', 'LABOR', 'UTILITIES', 'MAINTENANCE', 'TRANSPORT', 'OTHER')),
    amount NUMERIC(12, 2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    pen_id VARCHAR(64) REFERENCES pens(id) ON DELETE SET NULL,
    goat_id VARCHAR(64) REFERENCES goats(id) ON DELETE SET NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('CASH', 'UPI', 'BANK_TRANSFER')),
    paid_to VARCHAR(255) NOT NULL,
    description TEXT,
    receipt_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Operations & Tasks
CREATE TABLE IF NOT EXISTS farm_tasks (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    pen_id VARCHAR(64) REFERENCES pens(id) ON DELETE SET NULL,
    assigned_worker VARCHAR(255) NOT NULL,
    due_time VARCHAR(50),
    priority VARCHAR(30) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Activity & Audit Logs (Immutable)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100),
    entity_id VARCHAR(64),
    old_value JSONB,
    new_value JSONB,
    details TEXT NOT NULL,
    module VARCHAR(50) NOT NULL CHECK (module IN ('LIVESTOCK', 'POS', 'FINANCE', 'INVENTORY', 'HEALTH', 'AUTH', 'SETTINGS')),
    ip_address VARCHAR(100)
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE AT SCALE (100,000+ Transactions)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_goats_farm_status ON goats(farm_id, status);
CREATE INDEX IF NOT EXISTS idx_goats_tag_number ON goats(tag_number);
CREATE INDEX IF NOT EXISTS idx_goats_pen_id ON goats(pen_id);
CREATE INDEX IF NOT EXISTS idx_weight_records_goat_id ON weight_records(goat_id);
CREATE INDEX IF NOT EXISTS idx_weight_records_date ON weight_records(recorded_at);
CREATE INDEX IF NOT EXISTS idx_health_records_goat_id ON health_records(goat_id);
CREATE INDEX IF NOT EXISTS idx_sales_farm_date ON sales(farm_id, date);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoice_number ON sales(invoice_number);
CREATE INDEX IF NOT EXISTS idx_customer_ledger_cust_date ON customer_ledger(customer_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_module ON audit_logs(module);
