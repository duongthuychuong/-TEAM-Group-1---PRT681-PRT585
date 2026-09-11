USE PRT681_Groundwater;

-- ============================================
-- 1. WATER QUALITY SAMPLE COUNT
-- ============================================

SELECT
    COUNT(*) AS TotalSamples,
    COUNT(DISTINCT BORE_NO) AS UniqueBores
FROM Water_Quality;


-- ============================================
-- 2. pH STATISTICS
-- ============================================

SELECT
    AVG(PH_LAB) AS AveragePH,
    MIN(PH_LAB) AS MinimumPH,
    MAX(PH_LAB) AS MaximumPH
FROM Water_Quality
WHERE PH_LAB IS NOT NULL;


-- ============================================
-- 3. ELECTRICAL CONDUCTIVITY STATISTICS
-- ============================================

SELECT
    AVG(EC_LAB) AS AverageEC,
    MIN(EC_LAB) AS MinimumEC,
    MAX(EC_LAB) AS MaximumEC
FROM Water_Quality
WHERE EC_LAB IS NOT NULL;


-- ============================================
-- 4. TOTAL DISSOLVED SOLIDS
-- ============================================

SELECT
    AVG(TDS) AS AverageTDS,
    MIN(TDS) AS MinimumTDS,
    MAX(TDS) AS MaximumTDS
FROM Water_Quality
WHERE TDS IS NOT NULL;


-- ============================================
-- 5. HARDNESS
-- ============================================

SELECT
    AVG(HARD) AS AverageHardness,
    MIN(HARD) AS MinimumHardness,
    MAX(HARD) AS MaximumHardness
FROM Water_Quality
WHERE HARD IS NOT NULL;


-- ============================================
-- 6. TOP 10 HIGHEST TDS SAMPLES
-- ============================================

SELECT TOP 10
    BORE_NO,
    SAMPLEDATE,
    PH_LAB,
    EC_LAB,
    TDS,
    HARD,
    CHLORIDE
FROM Water_Quality
WHERE TDS IS NOT NULL
ORDER BY TDS DESC;


-- ============================================
-- 7. TOP 10 HIGHEST EC SAMPLES
-- ============================================

SELECT TOP 10
    BORE_NO,
    SAMPLEDATE,
    PH_LAB,
    EC_LAB,
    TDS,
    HARD
FROM Water_Quality
WHERE EC_LAB IS NOT NULL
ORDER BY EC_LAB DESC;