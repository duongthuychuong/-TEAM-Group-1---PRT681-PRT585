USE SuperstoreDB;
GO


/* =========================================================
   01. TOTAL NUMBER OF RECORDS
   ========================================================= */

SELECT
    COUNT(*) AS TotalRecords
FROM dbo.Orders;


/* =========================================================
   02. FIRST 10 ORDERS
   ========================================================= */

SELECT TOP 10 *
FROM dbo.Orders;


/* =========================================================
   03. TOTAL SALES
   ========================================================= */

SELECT
    SUM(Sales) AS TotalSales
FROM dbo.Orders;


/* =========================================================
   04. TOTAL PROFIT
   ========================================================= */

SELECT
    SUM(Profit) AS TotalProfit
FROM dbo.Orders;


/* =========================================================
   05. AVERAGE SALES PER RECORD
   ========================================================= */

SELECT
    AVG(Sales) AS AverageSales
FROM dbo.Orders;


/* =========================================================
   06. MINIMUM AND MAXIMUM SALES
   ========================================================= */

SELECT
    MIN(Sales) AS MinimumSales,
    MAX(Sales) AS MaximumSales
FROM dbo.Orders;


/* =========================================================
   07. SALES BY CATEGORY
   ========================================================= */

SELECT
    Category,
    SUM(Sales) AS TotalSales
FROM dbo.Orders
GROUP BY Category
ORDER BY TotalSales DESC;


/* =========================================================
   08. SALES AND PROFIT BY CATEGORY
   ========================================================= */

SELECT
    Category,
    SUM(Sales) AS TotalSales,
    SUM(Profit) AS TotalProfit
FROM dbo.Orders
GROUP BY Category
ORDER BY TotalSales DESC;


/* =========================================================
   09. SALES BY REGION
   ========================================================= */

SELECT
    Region,
    SUM(Sales) AS TotalSales
FROM dbo.Orders
GROUP BY Region
ORDER BY TotalSales DESC;


/* =========================================================
   10. PROFIT BY REGION
   ========================================================= */

SELECT
    Region,
    SUM(Profit) AS TotalProfit
FROM dbo.Orders
GROUP BY Region
ORDER BY TotalProfit DESC;


/* =========================================================
   11. SALES BY STATE / PROVINCE
   ========================================================= */

SELECT
    [State/Province],
    SUM(Sales) AS TotalSales
FROM dbo.Orders
GROUP BY [State/Province]
ORDER BY TotalSales DESC;


/* =========================================================
   12. TOP 10 CUSTOMERS BY SALES
   ========================================================= */

SELECT TOP 10
    [Customer Name],
    SUM(Sales) AS TotalSales
FROM dbo.Orders
GROUP BY [Customer Name]
ORDER BY TotalSales DESC;


/* =========================================================
   13. TOP 10 PRODUCTS BY SALES
   ========================================================= */

SELECT TOP 10
    [Product Name],
    SUM(Sales) AS TotalSales
FROM dbo.Orders
GROUP BY [Product Name]
ORDER BY TotalSales DESC;


/* =========================================================
   14. TOP 10 PRODUCTS BY PROFIT
   ========================================================= */

SELECT TOP 10
    [Product Name],
    SUM(Profit) AS TotalProfit
FROM dbo.Orders
GROUP BY [Product Name]
ORDER BY TotalProfit DESC;


/* =========================================================
   15. SALES AND PROFIT BY SEGMENT
   ========================================================= */

SELECT
    Segment,
    SUM(Sales) AS TotalSales,
    SUM(Profit) AS TotalProfit
FROM dbo.Orders
GROUP BY Segment
ORDER BY TotalSales DESC;


/* =========================================================
   16. SALES BY SHIP MODE
   ========================================================= */

SELECT
    [Ship Mode],
    COUNT(*) AS NumberOfRecords,
    SUM(Sales) AS TotalSales
FROM dbo.Orders
GROUP BY [Ship Mode]
ORDER BY TotalSales DESC;


/* =========================================================
   17. SALES AND PROFIT BY YEAR
   ========================================================= */

SELECT
    YEAR([Order Date]) AS OrderYear,
    SUM(Sales) AS TotalSales,
    SUM(Profit) AS TotalProfit
FROM dbo.Orders
GROUP BY YEAR([Order Date])
ORDER BY OrderYear;


/* =========================================================
   18. MONTHLY SALES TREND
   ========================================================= */

SELECT
    YEAR([Order Date]) AS OrderYear,
    MONTH([Order Date]) AS OrderMonth,
    SUM(Sales) AS TotalSales
FROM dbo.Orders
GROUP BY
    YEAR([Order Date]),
    MONTH([Order Date])
ORDER BY
    OrderYear,
    OrderMonth;


/* =========================================================
   19. PROFIT MARGIN BY CATEGORY
   ========================================================= */

SELECT
    Category,
    SUM(Sales) AS TotalSales,
    SUM(Profit) AS TotalProfit,
    ROUND(
        SUM(Profit) * 100.0 / NULLIF(SUM(Sales), 0),
        2
    ) AS ProfitMarginPercent
FROM dbo.Orders
GROUP BY Category
ORDER BY ProfitMarginPercent DESC;


/* =========================================================
   20. CATEGORY + REGION PERFORMANCE
   ========================================================= */

SELECT
    Category,
    Region,
    SUM(Sales) AS TotalSales,
    SUM(Profit) AS TotalProfit
FROM dbo.Orders
GROUP BY
    Category,
    Region
ORDER BY TotalSales DESC;