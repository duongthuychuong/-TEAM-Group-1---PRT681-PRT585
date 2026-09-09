SELECT
    `Sub-Category`,
    ROUND(SUM(`Profit`), 2) AS Total_Profit
FROM sales
GROUP BY `Sub-Category`
ORDER BY Total_Profit DESC;