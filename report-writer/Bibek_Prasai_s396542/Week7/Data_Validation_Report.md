Dataset selected
NT Government Bore Locations, Water Quality and Groundwater Levels.
Dataset overview
Bores: 43,225
Water Quality: 84,769
Groundwater Levels: 2,405
Total: 130,399 records.
Main fields, geographic information, water-quality measurements and monitoring information.
Initial data inspection
Loaded all three shapefiles successfully using GeoPandas.
Confirmed their columns and data types.
Confirmed the shapefile components work correctly.
Data-quality profiling
Missing-value analysis.
Duplicate-row checks.
Unique identifier counts.
Important categorical values.
Date ranges.
Water-quality sample distribution.
Relationship validation
Bores has 43,225 unique UFI.
Bores has 43,115 unique BORE_NO.
160 rows have duplicated BORE_NO.
Water Quality has 16,929 unique BORE_NO.
100% of Water Quality BORE_NO values match Bores.
100% of Groundwater Level UFI values match Bores.
Water Quality averages about 5 samples per bore, with a maximum of 411.
Database design decision
BORES.UFI → primary key.
WATER_QUALITY.BORE_NO → relationship to Bores.
GROUNDWATER_LEVELS.UFI → relationship to Bores.