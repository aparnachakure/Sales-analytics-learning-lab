# Power BI Dashboard

## Dashboard objective

Turn the sales dataset into an interactive management dashboard showing revenue, profitability, order volume, product performance and regional/category trends.

## Recommended pages

### Page 1 — Executive Overview

**KPI cards**
- Total Revenue
- Total Profit
- Total Orders
- Average Order Value
- Profit Margin

**Visuals**
- Monthly Revenue and Profit trend
- Revenue by Category
- Revenue by Region
- Top Products by Revenue

**Slicers**
- Order Date
- Region
- Category

### Page 2 — Product & Customer Analysis

**Visuals**
- Product Revenue vs Profit
- Units Sold by Product
- Customer Revenue
- Discount vs Profit
- Category Profit Margin

## DAX measures

```DAX
Total Revenue = SUM(sales[revenue])

Total Profit = SUM(sales[profit])

Total Orders = DISTINCTCOUNT(sales[order_id])

Total Units = SUM(sales[units])

Average Order Value = DIVIDE([Total Revenue], [Total Orders])

Profit Margin = DIVIDE([Total Profit], [Total Revenue])

Revenue Contribution % =
DIVIDE(
    [Total Revenue],
    CALCULATE([Total Revenue], ALL(sales[category]))
)
```

Format `Profit Margin` and `Revenue Contribution %` as percentages.

## Important portfolio note

The `.pbix` file is intentionally not stored in this repository version because Power BI Desktop files are binary and can be large. Build the dashboard using the CSV and the measures above, then add dashboard screenshots to the repository under `screenshots/` if desired.
