# Data Cleaning & Preparation

The current dataset is already structured for analysis, so the cleaning process focuses on validation rather than inventing corrections.

## Checks performed

1. Confirmed a unique `order_id` for each order.
2. Checked required fields for blank values.
3. Confirmed `order_date` follows ISO `YYYY-MM-DD` format.
4. Confirmed numeric fields (`units`, `unit_price`, `discount`, `revenue`, `cost`, `profit`) are numeric.
5. Checked that discounts are within the expected 0–100% range.
6. Validated the business calculations:
   - Revenue = Units × Unit Price × (1 − Discount)
   - Profit = Revenue − Cost
7. Created `data/cleaned_sales_data.csv` as the analysis-ready copy.

## Validation result

All 24 records pass the basic validation checks used in this learning project.

For a production dataset, the same checks should be implemented as repeatable SQL/Excel/Power Query transformations rather than performed manually.
