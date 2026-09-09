SELECT
    `Order ID`,
    `Product Name`,
    `Sales`
FROM sales
WHERE `Sales` > 1000
ORDER BY `Sales` DESC;