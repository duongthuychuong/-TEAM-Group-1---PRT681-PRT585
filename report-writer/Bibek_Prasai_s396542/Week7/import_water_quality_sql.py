import geopandas as gpd
import pyodbc
import math

# ---------------------------------------------------------
# File path
# ---------------------------------------------------------
shapefile = r"C:\Users\prasa\MIT\Trimester 3\PRT681\-TEAM-Group-1---PRT681-PRT585\report-writer\Bibek_Prasai_s396542\Week7\Bores_water_quality.shp"

# ---------------------------------------------------------
# Helper functions
# ---------------------------------------------------------
def clean_text(value):
    if value is None:
        return None

    if isinstance(value, float) and math.isnan(value):
        return None

    text = str(value).strip()

    if text.lower() in ("nan", "none", ""):
        return None

    return text


def clean_decimal(value):
    if value is None:
        return None

    if isinstance(value, float) and math.isnan(value):
        return None

    return float(value)


def clean_int(value):
    if value is None:
        return None

    if isinstance(value, float) and math.isnan(value):
        return None

    return int(value)


# ---------------------------------------------------------
# Read shapefile
# ---------------------------------------------------------
print("Reading Bores_water_quality.shp...")

gdf = gpd.read_file(shapefile)

print(f"Rows found: {len(gdf)}")

# ---------------------------------------------------------
# Connect to SQL Server
# ---------------------------------------------------------
print("Connecting to SQL Server...")

conn = pyodbc.connect(
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=PRT681_Groundwater;"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)

cursor = conn.cursor()

# ---------------------------------------------------------
# SQL insert
# ---------------------------------------------------------
insert_sql = """
INSERT INTO Water_Quality (
    UFI, BORE_NO, WATER_DATA, SAMPLENUM, SAMPLEDATE, SAMPLETIME,
    EC_FIELD_F, EC_FIELD, PH_FIELD_F, PH_FIELD, TEMP_F, TEMP,
    EC_LAB_F, EC_LAB, PH_LAB_F, PH_LAB,
    ALK_TOT_F, ALK_TOTAL, OH_FLAG, OH,
    HARD_F, HARD, TSS_F, TSS, TDS_F, TDS,
    NA_SOL_F, NA_SOL, NA_TOTAL_F, NA_TOTAL,
    K_SOL_F, K_SOL, CA_SOL_F, CA_SOL, MG_SOL_F, MG_SOL,
    CHLORIDE_F, CHLORIDE, HCO3_F, HCO3, CO3_F, CO3,
    SO4_SOL_F, SO4_SOL, SO4_TOT_F, SO4_TOTAL,
    NO3_F, NO3, F_F, F,
    FE_TOTAL_F, FE_TOTAL, SIO2_SOL_F, SIO2_SOL,
    SIO2_TOT_F, SIO2_TOTAL, PO4_F, PO4, NACL_F, NACL
)
VALUES (
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?
)
"""

# ---------------------------------------------------------
# Import rows
# ---------------------------------------------------------
batch = []
batch_size = 500

for index, row in gdf.iterrows():

    values = (
        clean_int(row["UFI"]),
        clean_text(row["BORE_NO"]),
        clean_text(row["WATER_DATA"]),
        clean_text(row["SAMPLENUM"]),
        clean_text(row["SAMPLEDATE"]),
        clean_text(row["SAMPLETIME"]),

        clean_text(row["EC_FIELD_F"]),
        clean_decimal(row["EC_FIELD"]),
        clean_text(row["PH_FIELD_F"]),
        clean_decimal(row["PH_FIELD"]),
        clean_text(row["TEMP_F"]),
        clean_decimal(row["TEMP"]),

        clean_text(row["EC_LAB_F"]),
        clean_decimal(row["EC_LAB"]),
        clean_text(row["PH_LAB_F"]),
        clean_decimal(row["PH_LAB"]),

        clean_text(row["ALK_TOT_F"]),
        clean_decimal(row["ALK_TOTAL"]),
        clean_text(row["OH_FLAG"]),
        clean_decimal(row["OH"]),

        clean_text(row["HARD_F"]),
        clean_decimal(row["HARD"]),
        clean_text(row["TSS_F"]),
        clean_decimal(row["TSS"]),
        clean_text(row["TDS_F"]),
        clean_decimal(row["TDS"]),

        clean_text(row["NA_SOL_F"]),
        clean_decimal(row["NA_SOL"]),
        clean_text(row["NA_TOTAL_F"]),
        clean_decimal(row["NA_TOTAL"]),

        clean_text(row["K_SOL_F"]),
        clean_decimal(row["K_SOL"]),
        clean_text(row["CA_SOL_F"]),
        clean_decimal(row["CA_SOL"]),
        clean_text(row["MG_SOL_F"]),
        clean_decimal(row["MG_SOL"]),

        clean_text(row["CHLORIDE_F"]),
        clean_decimal(row["CHLORIDE"]),
        clean_text(row["HCO3_F"]),
        clean_decimal(row["HCO3"]),
        clean_text(row["CO3_F"]),
        clean_decimal(row["CO3"]),

        clean_text(row["SO4_SOL_F"]),
        clean_decimal(row["SO4_SOL"]),
        clean_text(row["SO4_TOT_F"]),
        clean_decimal(row["SO4_TOTAL"]),

        clean_text(row["NO3_F"]),
        clean_decimal(row["NO3"]),
        clean_text(row["F_F"]),
        clean_decimal(row["F"]),

        clean_text(row["FE_TOTAL_F"]),
        clean_decimal(row["FE_TOTAL"]),
        clean_text(row["SIO2_SOL_F"]),
        clean_decimal(row["SIO2_SOL"]),

        clean_text(row["SIO2_TOT_F"]),
        clean_decimal(row["SIO2_TOTAL"]),
        clean_text(row["PO4_F"]),
        clean_decimal(row["PO4"]),
        clean_text(row["NACL_F"]),
        clean_decimal(row["NACL"])
    )

    batch.append(values)

    if len(batch) >= batch_size:
        cursor.executemany(insert_sql, batch)
        conn.commit()

        print(f"Imported {index + 1} / {len(gdf)} rows")

        batch = []

# ---------------------------------------------------------
# Import remaining rows
# ---------------------------------------------------------
if batch:
    cursor.executemany(insert_sql, batch)
    conn.commit()

# ---------------------------------------------------------
# Close connection
# ---------------------------------------------------------
cursor.close()
conn.close()

print("=" * 60)
print("Water Quality import completed successfully.")
print(f"Total rows imported: {len(gdf)}")
print("=" * 60)