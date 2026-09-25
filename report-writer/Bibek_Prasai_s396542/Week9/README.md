---
license: cc-by-4.0
task_categories:
  - tabular-classification
  - tabular-regression
  - table-question-answering
language:
  - en
tags:
  - retail
  - australia
  - synthetic
  - time-series
  - sql-benchmark
  - star-schema
size_categories:
  - 100K<n<1M
configs:
  - config_name: regions
    data_files:
      - split: train
        path: data/regions/train-*.parquet
  - config_name: districts
    data_files:
      - split: train
        path: data/districts/train-*.parquet
  - config_name: suppliers
    data_files:
      - split: train
        path: data/suppliers/train-*.parquet
  - config_name: brands
    data_files:
      - split: train
        path: data/brands/train-*.parquet
  - config_name: categories
    data_files:
      - split: train
        path: data/categories/train-*.parquet
  - config_name: customers
    data_files:
      - split: train
        path: data/customers/train-*.parquet
  - config_name: stores
    data_files:
      - split: train
        path: data/stores/train-*.parquet
  - config_name: products
    data_files:
      - split: train
        path: data/products/train-*.parquet
  - config_name: promotions
    data_files:
      - split: train
        path: data/promotions/train-*.parquet
  - config_name: transactions
    data_files:
      - split: train
        path: data/transactions/train-*.parquet
  - config_name: items
    data_files:
      - split: train
        path: data/items/train-*.parquet
  - config_name: returns
    data_files:
      - split: train
        path: data/returns/train-*.parquet
  - config_name: date_dim
    data_files:
      - split: train
        path: data/date_dim/train-*.parquet
---

# Maycee Retail Dataset

Published by [SDataPro](https://sdatapro.com).

Maycee Retail is a realistic synthetic Australian retail dataset for SQL
learning, data engineering practice, analytics engineering, BI demos, and
LLM/text-to-SQL evaluation.

## Dataset Summary

This free Hugging Face release covers **2017-01-01 to 2019-12-31**: 3 years of daily
temporal depth (2017-2019). It contains 164,968 transactions,
420,016 line items, 8,762 returns, and full current-state
dimension snapshots as of the end of the free-tier window.

Premium 2020+ history and ongoing daily updates are available by commercial
licence. Contact [SData](https://sdatapro.com) for access.

| Table | Type | Rows | Description |
|---|---:|---:|---|
| `transactions` | Fact | 164,968 | Customer purchases by date, store, customer, channel, and payment method |
| `items` | Fact | 420,016 | Line items on each transaction, including price, discount, and gross profit |
| `returns` | Fact | 8,762 | Refund events linked to original items |
| `customers` | Dimension | 3,157 | Customers with demographics and loyalty tier |
| `products` | Dimension | 342 | Products with brand, category, cost, and price |
| `stores` | Dimension | 16 | Stores across Australian regions |
| `promotions` | Dimension | 45 | Date-scoped discount campaigns |
| `regions` | Dimension | 8 | Australian states and territories |
| `districts` | Dimension | 35 | Cities or districts within each region |
| `categories` | Dimension | 36 | Self-referential product hierarchy |
| `brands` | Dimension | 37 | Product brands |
| `suppliers` | Dimension | 20 | Product suppliers |
| `date_dim` | Dimension | 1,095 | Calendar, fiscal, holiday, and season attributes |

## Loading the Data

```python
from datasets import load_dataset

transactions = load_dataset("SDataPro/maycee-retail-dataset", "transactions", split="train")
df = transactions.to_pandas()
```

Join tables in pandas:

```python
from datasets import load_dataset

transactions = load_dataset("SDataPro/maycee-retail-dataset", "transactions", split="train").to_pandas()
customers = load_dataset("SDataPro/maycee-retail-dataset", "customers", split="train").to_pandas()

result = transactions.merge(customers, on="customer_id", how="left")
```

Or query directly with DuckDB:

```sql
SELECT t.transaction_date, t.total_amount, c.loyalty_tier
FROM 'hf://datasets/SDataPro/maycee-retail-dataset/data/transactions/train-*.parquet' t
JOIN 'hf://datasets/SDataPro/maycee-retail-dataset/data/customers/train-0.parquet' c
  ON t.customer_id = c.customer_id
WHERE t.partition_date LIKE '2019-%';
```

## Hugging Face Layout

The Hugging Face repo uses table-sharded Parquet files optimized for
`datasets.load_dataset()` and direct DuckDB reads:

```text
data/transactions/train-*.parquet
data/items/train-*.parquet
data/returns/train-*.parquet
data/<dimension>/train-0.parquet
data/date_dim/train-0.parquet
```

Fact tables include a `partition_date` column so users can filter by day. The
canonical S3 release keeps the original `dt=YYYY-MM-DD/` partition layout.

## Deliberate Data Quality Scenarios

This free tier includes documented real-world data quality scenarios for
learning and benchmarking:

| Scenario | Window | Symptom |
|---|---|---|
| POS phone capture outage | 2018-07-01 to 2018-09-30 | `customers.phone` is NULL for sign-ups in this quarter |
| Year-end returns backlog | Nov-Dec 2019 transactions | Some returns have `return_date` in Jan-Feb after the original purchase window |

These are intentional and documented, not bugs.

## Whitepaper

For the full data model and methodology, see the [Maycee Retail whitepaper](https://sdatapro.com).

## Licence

The Maycee Retail free tier (2017-2019) is released under **CC BY 4.0**. It may
be used, shared, and adapted, including commercially, with attribution to
SData / Maycee Retail Dataset.

Premium data from 2020 onward, licence manifests, AI benchmark artefacts,
evaluator assets, gold SQL, hidden evals, model reports, customer-specific
files, and private ops files are not included in this free licence.

## Citation

```bibtex
@dataset{sdata_maycee_retail_dataset_2026,
  title = {Maycee Retail Dataset},
  author = {SData},
  year = {2026},
  version = {1.0},
  url = {https://huggingface.co/datasets/SDataPro/maycee-retail-dataset}
}
```

## Changelog

### v1.0.1 (2026-07-05)
- Data quality fix: removed markdown formatting from `promotions.description` enrichment column across all 2017-2019 partitions. All enrichment text is now plain prose with no markdown headings, bold, or symbols.
