import geopandas as gpd
import pyodbc
import math

# --------------------------------------------------
# FILE PATH
# --------------------------------------------------
shapefile = r"C:\Users\prasa\MIT\Trimester 3\PRT681\-TEAM-Group-1---PRT681-PRT585\report-writer\Bibek_Prasai_s396542\Week7\Bores.shp"

# --------------------------------------------------
# READ SHAPEFILE
# --------------------------------------------------
print("Reading Bores.shp...")

gdf = gpd.read_file(shapefile)

print(f"Rows found: {len(gdf)}")

# --------------------------------------------------
# CONNECT TO SQL SERVER
# --------------------------------------------------
print("Connecting to SQL Server...")

conn = pyodbc.connect(
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=PRT681_Groundwater;"
    "Trusted_Connection=yes;"
    "TrustServerCertificate=yes;"
)

cursor = conn.cursor()

# --------------------------------------------------
# SQL INSERT
# --------------------------------------------------
insert_sql = """
INSERT INTO Bores (
    UFI,
    BORE_NO,
    BORE_NAME,
    BOREREPORT,
    DRY_RISK,
    RISK_CLASS,
    ASSESSYEAR,
    GWRESOURCE,
    OWNER_INFO,
    WATER_DATA,
    STATUS,
    STATUSCONS,
    PURPOSE,
    MONITORED,
    YIELD,
    YIELDCLASS,
    COMPL_DATE,
    COMPLDEPTH,
    DRILLDEPTH,
    WATERLEVEL,
    TESTDATE,
    TESTTYPE,
    GAMMA,
    LOCALITY,
    POSACC,
    LATITUDE,
    LONGITUDE,
    UTM_ZONE,
    EASTING,
    NORTHING,
    ASSESS_ACT
)
VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
)
"""

# --------------------------------------------------
# CLEAN VALUES
# --------------------------------------------------
def clean(value):
    if value is None:
        return None

    try:
        if math.isnan(value):
            return None
    except (TypeError, ValueError):
        pass

    return value

# --------------------------------------------------
# BUILD ROWS
# --------------------------------------------------
rows = []

for _, row in gdf.iterrows():

    values = (
        clean(row["UFI"]),
        clean(row["BORE_NO"]),
        clean(row["BORE_NAME"]),
        clean(row["BOREREPORT"]),
        clean(row["DRY_RISK"]),
        clean(row["RISK_CLASS"]),
        clean(row["ASSESSYEAR"]),
        clean(row["GWRESOURCE"]),
        clean(row["OWNER_INFO"]),
        clean(row["WATER_DATA"]),
        clean(row["STATUS"]),
        clean(row["STATUSCONS"]),
        clean(row["PURPOSE"]),
        clean(row["MONITORED"]),
        clean(row["YIELD"]),
        clean(row["YIELDCLASS"]),
        clean(row["COMPL_DATE"]),
        clean(row["COMPLDEPTH"]),
        clean(row["DRILLDEPTH"]),
        clean(row["WATERLEVEL"]),
        clean(row["TESTDATE"]),
        clean(row["TESTTYPE"]),
        clean(row["GAMMA"]),
        clean(row["LOCALITY"]),
        clean(row["POSACC"]),
        clean(row["LATITUDE"]),
        clean(row["LONGITUDE"]),
        clean(row["UTM_ZONE"]),
        clean(row["EASTING"]),
        clean(row["NORTHING"]),
        clean(row["ASSESS_ACT"])
    )

    rows.append(values)

# --------------------------------------------------
# INSERT IN BATCHES
# --------------------------------------------------
batch_size = 1000

for start in range(0, len(rows), batch_size):

    batch = rows[start:start + batch_size]

    cursor.executemany(insert_sql, batch)
    conn.commit()

    print(f"Inserted {min(start + batch_size, len(rows))} / {len(rows)} records...")

# --------------------------------------------------
# CLOSE
# --------------------------------------------------
cursor.close()
conn.close()

print("================================")
print("Bores import completed.")
print(f"Total records imported: {len(rows)}")
print("================================")