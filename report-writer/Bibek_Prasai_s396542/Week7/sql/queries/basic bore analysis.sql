USE PRT681_Groundwater;

-- ============================================
-- 1. BORE STATUS
-- ============================================

SELECT
    STATUS,
    COUNT(*) AS NumberOfBores
FROM Bores
GROUP BY STATUS
ORDER BY NumberOfBores DESC;


-- ============================================
-- 2. BORE PURPOSE
-- ============================================

SELECT
    PURPOSE,
    COUNT(*) AS NumberOfBores
FROM Bores
GROUP BY PURPOSE
ORDER BY NumberOfBores DESC;


-- ============================================
-- 3. RISK CLASS
-- ============================================

SELECT
    RISK_CLASS,
    COUNT(*) AS NumberOfBores
FROM Bores
GROUP BY RISK_CLASS
ORDER BY RISK_CLASS;


-- ============================================
-- 4. YIELD CLASS
-- ============================================

SELECT
    YIELDCLASS,
    COUNT(*) AS NumberOfBores
FROM Bores
GROUP BY YIELDCLASS
ORDER BY NumberOfBores DESC;


-- ============================================
-- 5. AVERAGE BORE YIELD
-- ============================================

SELECT
    AVG(YIELD) AS AverageYield,
    MIN(YIELD) AS MinimumYield,
    MAX(YIELD) AS MaximumYield
FROM Bores
WHERE YIELD IS NOT NULL;


-- ============================================
-- 6. AVERAGE DRILL DEPTH
-- ============================================

SELECT
    AVG(DRILLDEPTH) AS AverageDrillDepth,
    MIN(DRILLDEPTH) AS MinimumDrillDepth,
    MAX(DRILLDEPTH) AS MaximumDrillDepth
FROM Bores
WHERE DRILLDEPTH IS NOT NULL;


-- ============================================
-- 7. TOP 10 HIGHEST-YIELD BORES
-- ============================================

SELECT TOP 10
    UFI,
    BORE_NO,
    BORE_NAME,
    YIELD,
    YIELDCLASS,
    STATUS,
    PURPOSE
FROM Bores
WHERE YIELD IS NOT NULL
ORDER BY YIELD DESC;