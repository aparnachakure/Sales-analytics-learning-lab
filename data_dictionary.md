# Data Dictionary

The project uses a small synthetic sales dataset for learning and portfolio demonstration.

| Column | Description | Type |
|---|---|---|
| order_id | Unique order identifier | Text |
| order_date | Date of the order | Date |
| customer | Customer name | Text |
| region | Sales region | Text |
| category | Product category | Text |
| product | Product name | Text |
| units | Units sold in the order | Integer |
| unit_price | Price per unit before discount | Decimal |
| discount | Discount applied to the order | Decimal |
| revenue | Net sales revenue | Decimal |
| cost | Cost associated with the order | Decimal |
| profit | Revenue minus cost | Decimal |

## Business calculations

- **Revenue** = Units × Unit Price × (1 − Discount)
- **Profit** = Revenue − Cost
- **Profit Margin** = Profit ÷ Revenue
- **Average Order Value (AOV)** = Revenue ÷ Number of Orders

The current learning dataset contains **24 orders from January through June 2025**. It is intentionally small so the complete workflow is easy to understand and reproduce.
