# Week 5 – Excel Reporting, SQL Fundamentals and Introduction to Power BI

## Overview

The main focus of Week 5 was developing practical reporting and data-analysis skills using Excel, SQL and Power BI. The Superstore Sales dataset was used throughout the practice activities to work with realistic business data.

The week began with Excel-based reporting, including data preparation, formulas, PivotTables and PivotCharts. SQL was then used to understand how the same type of business data can be queried and summarised from a database. Finally, Power BI was introduced to understand how data can be connected and prepared for interactive reporting.

The main objective was to understand how raw business data can be transformed into useful information for stakeholders.

## 1. Excel – Advanced Formulas and Functions

Excel was the main focus of the reporting practice. The Superstore Sales dataset was imported into Excel and reviewed to understand the different fields available, including order information, customer details, products, categories, regions, sales and profit.

Before creating the report, the dataset was checked and prepared to ensure that the information was suitable for analysis. This included reviewing column headings, checking data types, identifying possible inconsistencies and making sure that dates and numerical values could be used correctly in calculations.

### Formulas and Functions

A range of Excel functions was practised to calculate and analyse business information. Basic functions such as `SUM`, `AVERAGE`, `COUNT`, `MIN` and `MAX` were used to calculate summary statistics.

Conditional functions such as `COUNTIF` and `SUMIF` were used to calculate values based on specific conditions. `SUMIFS` was particularly useful when multiple conditions needed to be applied.

For example, sales could be calculated for a particular category, region or other business condition without manually filtering every record.

Logical functions such as `IF` were also explored to return different results depending on whether a condition was met.

Lookup functions were introduced as another way of retrieving related information from a dataset. These functions are useful when information needs to be matched between different tables or ranges.

The purpose of learning these functions was not just to understand their syntax, but to understand how they can be applied to practical reporting requirements.

## 2. PivotTables

PivotTables were used to summarise the Superstore dataset and quickly analyse large numbers of transactions.

Instead of manually calculating totals for every category or region, PivotTables allowed the data to be grouped into meaningful business dimensions.

Examples included analysing:

* Sales by category
* Sales by region
* Profit by category
* Sales by state
* Customer or product performance
* Sales over different periods

PivotTables were useful because the same dataset could be reorganised quickly to answer different stakeholder questions.

This demonstrated how Excel can be used to turn detailed transaction-level data into a concise summary suitable for business reporting.

## 3. PivotCharts

PivotCharts were created from the PivotTables to provide a visual representation of the analysis.

Charts made it easier to identify differences and trends that may not be immediately obvious from a table of numbers. For example, a chart comparing sales between categories allows stakeholders to quickly identify which categories are performing better.

Different chart types were considered depending on the question being answered. Bar or column charts were useful for comparing categories, while line charts were more suitable for showing changes over time.

The goal was to select visualisations based on the information they communicate rather than simply adding charts for appearance.

## 4. Static Excel Stakeholder Report

The main Excel practice task was to take the Superstore dataset and create a static report using PivotTables and PivotCharts.

The report was designed around **five stakeholder questions**. Each question required the data to be analysed and presented in a way that could provide a useful business insight.

The process involved:

1. Understanding the stakeholder question.
2. Identifying the relevant fields in the dataset.
3. Preparing the data where required.
4. Creating a PivotTable to calculate and summarise the required information.
5. Creating an appropriate PivotChart where visualisation was useful.
6. Reviewing the results and identifying the key insight.
7. Organising the results into a clear static report.

This exercise helped develop the ability to move from a business question to a data-driven answer.

## 5. SQL Essential Training

SQL was introduced as another method of working with structured business data.

A database environment was set up and SQL was used to create, retrieve and manipulate data. The Superstore dataset and additional practice data were used to understand how database queries work.

The main SQL commands practised included:

* `CREATE TABLE`
* `INSERT`
* `SELECT`
* `WHERE`
* `AND`
* `OR`
* `ORDER BY`
* `COUNT`
* `AVG`
* `MIN`
* `MAX`
* `GROUP BY`
* `UPDATE`
* `DELETE`

`SELECT` was used to retrieve information from tables, while `WHERE` was used to filter records.

`AND` and `OR` were used to apply multiple conditions, and `ORDER BY` was used to sort the returned results.

Aggregate functions such as `COUNT`, `AVG`, `MIN` and `MAX` were used to summarise data. `GROUP BY` was particularly important because it allowed results to be grouped by business categories such as region, category or customer.

For example, SQL can be used to calculate total sales for each category rather than manually calculating the results from individual transactions.

This provided an understanding of how data can be analysed directly within a database rather than relying entirely on spreadsheet software.

## 6. Introduction to Power BI

Power BI was introduced as the next step in the reporting process.

The purpose at this stage was to understand the basic Power BI environment and how data can be brought into Power BI for analysis. The Superstore data was used to explore the process of connecting a data source and loading the data into Power BI.

Power Query was also introduced. It is used for preparing, cleaning and transforming data before it is used in the Power BI data model.

The difference between Excel and Power BI was also considered. Excel is highly useful for spreadsheet-based calculations and static reports, while Power BI is designed more specifically for interactive business intelligence and dashboard reporting.

A basic understanding of Power BI at this stage provided the foundation for the more advanced Power BI work completed later.

## Key Learning Outcomes

By the end of Week 5, I had developed practical experience in using Excel to analyse and report on a realistic business dataset. I improved my understanding of advanced formulas, conditional calculations, PivotTables and PivotCharts, and learned how to structure analysis around stakeholder questions.

I also developed foundational SQL skills and learned how database queries can be used to retrieve, filter and summarise business data.

The introduction to Power BI provided an understanding of how data can move from a source such as Excel or SQL into a business intelligence platform. This created a foundation for the later work involving data modelling, DAX measures and interactive dashboards.

Overall, Week 5 established the core data-analysis skills required for the following stages of the reporting workflow: **Excel analysis → SQL data querying → Power BI data preparation → interactive business intelligence reporting.**
