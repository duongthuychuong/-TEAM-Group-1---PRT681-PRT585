import geopandas as gpd
import pyodbc
import math

# ---------------------------------------------------------
# File path
# ---------------------------------------------------------
shapefile = r"C:\Users\prasa\MIT\Trimester 3\PRT681\-TEAM-Group-1---PRT681-PRT585\report-writer\Bibek_Prasai_s396542\Week7\Bores_groundwater_level.shp"

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


def clean_int(value):
    if value is None:
        return None

    if isinstance(value, float) and math.isnan(value):
        return None

    return int(value)


def clean_decimal(value):
    if value is None:
        return None

    if isinstance(value, float) and math.isnan(value):
        return None

    return float(value)


# ---------------------------------------------------------
# Read shapefile
# ---------------------------------------------------------
print("Reading Bores_groundwater_level.shp...")

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
INSERT INTO Groundwater_Level (
    UFI,
    STATION,
    STATION_NA,
    MONITOR_TY,
    WATER_DATA,
    COMMENCE,
    CEASE,
    ACTIVE,
    LATITUDE,
    LONGITUDE,
    GRDATUM,
    UTM_ZONE,
    EASTING,
    NORTHING
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""

# ---------------------------------------------------------
# Import rows
# ---------------------------------------------------------
batch = []
batch_size = 500

for index, row in gdf.iterrows():

    values = (
        clean_int(row["UFI"]),
        clean_text(row["STATION"]),
        clean_text(row["STATION_NA"]),
        clean_text(row["MONITOR_TY"]),
        clean_text(row["WATER_DATA"]),
        clean_text(row["COMMENCE"]),
        clean_text(row["CEASE"]),
        clean_text(row["ACTIVE"]),
        clean_decimal(row["LATITUDE"]),
        clean_decimal(row["LONGITUDE"]),
        clean_text(row["GRDATUM"]),
        clean_int(row["UTM_ZONE"]),
        clean_decimal(row["EASTING"]),
        clean_decimal(row["NORTHING"])
    )

    batch.append(values)

    if len(batch) >= batch_size:
        cursor.executemany(insert_sql, batch)
        conn.commit()

        print(f"Imported {index + 1} / {len(gdf)} rows")

        batch = []

# Import remaining rows
if batch:
    cursor.executemany(insert_sql, batch)
    conn.commit()

# ---------------------------------------------------------
# Close connection
# ---------------------------------------------------------
cursor.close()
conn.close()

print("=" * 60)
print("Groundwater Level import completed successfully.")
print(f"Total rows imported: {len(gdf)}")
print("=" * 60)