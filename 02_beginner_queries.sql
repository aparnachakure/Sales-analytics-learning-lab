SELECT
  SUM(revenue) AS total_revenue,
  SUM(profit) AS total_profit,
  COUNT(*) AS total_orders,
  ROUND(AVG(revenue), 2) AS average_order_value,
  ROUND(SUM(profit) / NULLIF(SUM(revenue), 0) * 100, 2) AS profit_margin_percent
FROM sales;

SELECT
  strftime('%Y-%m', order_date) AS month,
  ROUND(SUM(revenue), 2) AS revenue,
  ROUND(SUM(profit), 2) AS profit,
  COUNT(*) AS orders
FROM sales
GROUP BY 1
ORDER BY 1;

SELECT
  category,
  ROUND(SUM(revenue), 2) AS revenue,
  ROUND(SUM(profit), 2) AS profit,
  SUM(units) AS units_sold
FROM sales
GROUP BY category
ORDER BY revenue DESC;

SELECT
  product,
  category,
  ROUND(SUM(revenue), 2) AS revenue,
  ROUND(SUM(profit), 2) AS profit,
  SUM(units) AS units_sold
FROM sales
GROUP BY product, category
ORDER BY revenue DESC
LIMIT 5;