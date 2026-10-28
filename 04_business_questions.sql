-- Advanced business questions for portfolio/interview practice.
-- SQLite syntax.

-- 1. Revenue and profit contribution by category
SELECT
  category,
  ROUND(SUM(revenue), 2) AS revenue,
  ROUND(SUM(profit), 2) AS profit,
  ROUND(SUM(revenue) * 100.0 / SUM(SUM(revenue)) OVER (), 2) AS revenue_contribution_pct,
  ROUND(SUM(profit) * 100.0 / SUM(SUM(profit)) OVER (), 2) AS profit_contribution_pct
FROM sales
GROUP BY category
ORDER BY revenue DESC;

-- 2. Monthly revenue, profit and month-over-month revenue growth
WITH monthly AS (
  SELECT
    strftime('%Y-%m', order_date) AS month,
    SUM(revenue) AS revenue,
    SUM(profit) AS profit
  FROM sales
  GROUP BY 1
), with_previous AS (
  SELECT
    month,
    revenue,
    profit,
    LAG(revenue) OVER (ORDER BY month) AS previous_month_revenue
  FROM monthly
)
SELECT
  month,
  ROUND(revenue, 2) AS revenue,
  ROUND(profit, 2) AS profit,
  ROUND((revenue - previous_month_revenue) * 100.0 / NULLIF(previous_month_revenue, 0), 2) AS mom_revenue_growth_pct
FROM with_previous
ORDER BY month;

-- 3. Top customers by revenue
SELECT
  customer,
  COUNT(*) AS orders,
  ROUND(SUM(revenue), 2) AS revenue,
  ROUND(SUM(profit), 2) AS profit
FROM sales
GROUP BY customer
ORDER BY revenue DESC;

-- 4. Product profitability: identify products with the highest profit margin
SELECT
  product,
  category,
  SUM(units) AS units_sold,
  ROUND(SUM(revenue), 2) AS revenue,
  ROUND(SUM(profit), 2) AS profit,
  ROUND(SUM(profit) * 100.0 / NULLIF(SUM(revenue), 0), 2) AS profit_margin_pct
FROM sales
GROUP BY product, category
ORDER BY profit_margin_pct DESC, revenue DESC;

-- 5. Discount vs profitability
SELECT
  CASE
    WHEN discount = 0 THEN '0%'
    WHEN discount <= 0.05 THEN '1-5%'
    WHEN discount <= 0.10 THEN '6-10%'
    ELSE '>10%'
  END AS discount_band,
  COUNT(*) AS orders,
  ROUND(SUM(revenue), 2) AS revenue,
  ROUND(SUM(profit), 2) AS profit,
  ROUND(SUM(profit) * 100.0 / NULLIF(SUM(revenue), 0), 2) AS profit_margin_pct
FROM sales
GROUP BY discount_band
ORDER BY MIN(discount);

-- 6. Best-performing region by profit margin
SELECT
  region,
  COUNT(*) AS orders,
  ROUND(SUM(revenue), 2) AS revenue,
  ROUND(SUM(profit), 2) AS profit,
  ROUND(SUM(profit) * 100.0 / NULLIF(SUM(revenue), 0), 2) AS profit_margin_pct
FROM sales
GROUP BY region
ORDER BY profit_margin_pct DESC;

-- 7. New vs returning customer orders
WITH customer_orders AS (
  SELECT customer, COUNT(*) AS order_count
  FROM sales
  GROUP BY customer
)
SELECT
  CASE WHEN order_count = 1 THEN 'One-time' ELSE 'Returning' END AS customer_type,
  SUM(order_count) AS orders,
  COUNT(*) AS customers
FROM customer_orders
GROUP BY customer_type;

-- 8. Highest-value orders
SELECT
  order_id,
  order_date,
  customer,
  product,
  ROUND(revenue, 2) AS revenue,
  ROUND(profit, 2) AS profit
FROM sales
ORDER BY revenue DESC
LIMIT 10;
