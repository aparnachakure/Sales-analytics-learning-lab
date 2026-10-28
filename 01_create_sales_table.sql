CREATE TABLE sales (
  order_id VARCHAR(20) PRIMARY KEY,
  order_date DATE NOT NULL,
  customer VARCHAR(100) NOT NULL,
  region VARCHAR(30) NOT NULL,
  category VARCHAR(40) NOT NULL,
  product VARCHAR(100) NOT NULL,
  units INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(5, 2) NOT NULL,
  revenue DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  profit DECIMAL(10, 2) NOT NULL
);

-- The VS Code setup uses the SQLite CLI to import the CSV:
-- sqlite3 sales.db "DROP TABLE IF EXISTS sales;" ".read sql/01_create_sales_table.sql" ".mode csv" ".import --skip 1 data/sales_data_for_excel.csv sales"

-- PostgreSQL users can use this equivalent import instead:
-- \copy sales FROM 'data/sales_data_for_excel.csv' WITH (FORMAT csv, HEADER true);