-- WEEK 3 - SQL FEATURES PRACTICE
USE WeeklyReportingPractice;
GO

-- Filtering
SELECT * FROM SalesImport WHERE Region = 'Darwin';

-- Date filter
SELECT * FROM SalesImport WHERE OrderDate >= '2026-08-01';

-- Aggregation
SELECT Region, SUM(Quantity * UnitPrice) AS Sales
FROM SalesImport
GROUP BY Region
ORDER BY Sales DESC;

-- CASE expression
SELECT Product, Quantity * UnitPrice AS LineTotal,
       CASE
         WHEN Quantity * UnitPrice >= 2000 THEN 'High'
         WHEN Quantity * UnitPrice >= 500 THEN 'Medium'
         ELSE 'Low'
       END AS ValueBand
FROM SalesImport;

-- NULL check
SELECT COUNT(*) AS MissingCustomerNames
FROM SalesImport
WHERE CustomerName IS NULL;

-- Duplicate check
SELECT OrderID, COUNT(*) AS Cnt
FROM SalesImport
GROUP BY OrderID
HAVING COUNT(*) > 1;
