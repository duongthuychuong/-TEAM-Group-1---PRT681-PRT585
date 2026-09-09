SELECT
    `Category`,
    ROUND(SUM(`Sales`), 2) AS Total_Sales
FROM sales
GROUP BY `Category`
ORDER BY Total_Sales DESC;