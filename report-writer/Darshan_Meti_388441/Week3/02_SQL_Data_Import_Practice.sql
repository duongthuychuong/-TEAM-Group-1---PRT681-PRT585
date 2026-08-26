-- WEEK 3 - SQL DATA IMPORT PRACTICE
-- Example written for SQL Server. Update the file path before running BULK INSERT.

CREATE DATABASE WeeklyReportingPractice;
GO
USE WeeklyReportingPractice;
GO

CREATE TABLE SalesImport (
    OrderID INT,
    OrderDate DATE,
    CustomerName VARCHAR(100),
    Product VARCHAR(100),
    Region VARCHAR(50),
    Quantity INT,
    UnitPrice DECIMAL(10,2)
);

-- Example CSV import pattern
-- BULK INSERT SalesImport
-- FROM 'C:\Data\sales_clean.csv'
-- WITH (FIRSTROW = 2, FIELDTERMINATOR = ',', ROWTERMINATOR = '0x0a', TABLOCK);

-- Validation after import
SELECT COUNT(*) AS ImportedRows FROM SalesImport;
SELECT TOP 10 * FROM SalesImport;
SELECT MIN(OrderDate) AS FirstDate, MAX(OrderDate) AS LastDate FROM SalesImport;
SELECT SUM(Quantity * UnitPrice) AS ImportedSalesTotal FROM SalesImport;

-- Data-quality checks
SELECT * FROM SalesImport WHERE CustomerName IS NULL OR Product IS NULL;
SELECT OrderID, COUNT(*) AS DuplicateCount
FROM SalesImport
GROUP BY OrderID
HAVING COUNT(*) > 1;
