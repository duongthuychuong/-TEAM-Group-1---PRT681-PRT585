-- WEEK 2 SQL BASICS PRACTICE
-- Student: Darshan | ID: S388441
-- Purpose: practise basic retrieval, filtering, sorting and aggregation.

CREATE TABLE SalesPractice (
    SaleID INT,
    Product VARCHAR(50),
    Region VARCHAR(30),
    Quantity INT,
    UnitPrice DECIMAL(10,2),
    SaleDate DATE
);

INSERT INTO SalesPractice VALUES
(1,'Laptop','Darwin',2,1200.00,'2026-08-01'),
(2,'Monitor','Darwin',4,350.00,'2026-08-02'),
(3,'Keyboard','Palmerston',6,80.00,'2026-08-02'),
(4,'Laptop','Palmerston',1,1250.00,'2026-08-03'),
(5,'Mouse','Darwin',10,35.00,'2026-08-03');

-- 1. View all records
SELECT * FROM SalesPractice;

-- 2. Select specific columns
SELECT Product, Region, Quantity FROM SalesPractice;

-- 3. Filter Darwin sales
SELECT * FROM SalesPractice WHERE Region = 'Darwin';

-- 4. Sort highest quantity first
SELECT * FROM SalesPractice ORDER BY Quantity DESC;

-- 5. Calculate line value
SELECT Product, Quantity, UnitPrice, Quantity * UnitPrice AS TotalValue
FROM SalesPractice;

-- 6. Total sales value
SELECT SUM(Quantity * UnitPrice) AS TotalSales FROM SalesPractice;

-- 7. Average unit price
SELECT AVG(UnitPrice) AS AveragePrice FROM SalesPractice;

-- 8. Count transactions by region
SELECT Region, COUNT(*) AS TransactionCount
FROM SalesPractice
GROUP BY Region;

-- 9. Sales by product
SELECT Product, SUM(Quantity * UnitPrice) AS ProductSales
FROM SalesPractice
GROUP BY Product
ORDER BY ProductSales DESC;

-- 10. Products above $100 unit price
SELECT Product, UnitPrice
FROM SalesPractice
WHERE UnitPrice > 100
ORDER BY UnitPrice DESC;
