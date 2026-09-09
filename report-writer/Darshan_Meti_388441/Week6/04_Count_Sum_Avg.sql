SELECT
    ROUND(SUM(`Sales`), 2) AS Total_Sales,
    ROUND(SUM(`Profit`), 2) AS Total_Profit
FROM sales;