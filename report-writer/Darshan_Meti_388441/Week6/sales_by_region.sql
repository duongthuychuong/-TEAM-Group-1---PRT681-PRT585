SELECT
    `Region`,
    ROUND(SUM(`Sales`), 2) AS Total_Sales
FROM sales
GROUP BY `Region`
ORDER BY Total_Sales DESC;