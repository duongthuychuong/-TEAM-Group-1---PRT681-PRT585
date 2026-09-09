SELECT
    `Segment`,
    ROUND(SUM(`Sales`), 2) AS Total_Sales
FROM sales
GROUP BY `Segment`
ORDER BY Total_Sales DESC;