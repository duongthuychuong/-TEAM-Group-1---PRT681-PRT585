import geopandas as gpd
import pyodbc
import math

# --------------------------------------------------
# FILE PATH
# --------------------------------------------------
shapefile = r"C:\Users\prasa\MIT\Trimester 3\PRT681\-TEAM-Group-1---PRT681-PRT585\report-writer\Bibek_Prasai_s396542\Week7\Bores.shp"

print("Reading Bores.shp...")

gdf = gpd.read_file(shapefile)

print(f"Rows found: {len(gdf)}")

# --------------------------------------------------
# SQL SERVER CONNECTION
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
# INSERT STATEMENT
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
# CLEAN FUNCTIONS
# --------------------------------------------------

def clean_text(value):
    if value is None:
        return None

    try:
        if isinstance(value, float) and math.isnan(value):
            return None
    except:
        pass

    return str(value)


def clean_int(value):
    if value is None:
        return None

    try:
        if math.isnan(value):
            return None
    except:
        pass

    return int(value)


def clean_decimal(value):
    if value is None:
        return None

    try:
        if math.isnan(value):
            return None
    except:
        pass

    return float(value)


def clean_bit(value):
    if value is None:
        return None

    try:
        if math.isnan(value):
            return None
    except:
        pass

    return bool(value)


# --------------------------------------------------
# BUILD ROWS
# --------------------------------------------------

rows = []

for _, row in gdf.iterrows():

    values = (
        # 1 UFI
        clean_int(row["UFI"]),

        # 2-5 text
        clean_text(row["BORE_NO"]),
        clean_text(row["BORE_NAME"]),
        clean_text(row["BOREREPORT"]),
        clean_text(row["DRY_RISK"]),

        # 6 numeric
        clean_decimal(row["RISK_CLASS"]),

        # 7 integer
        clean_int(row["ASSESSYEAR"]),

        # 8-14 text
        clean_text(row["GWRESOURCE"]),
        clean_text(row["OWNER_INFO"]),
        clean_text(row["WATER_DATA"]),
        clean_text(row["STATUS"]),
        clean_text(row["STATUSCONS"]),
        clean_text(row["PURPOSE"]),
        clean_text(row["MONITORED"]),

        # 15 numeric
        clean_decimal(row["YIELD"]),

        # 16-17 text
        clean_text(row["YIELDCLASS"]),
        clean_text(row["COMPL_DATE"]),

        # 18-20 numeric
        clean_decimal(row["COMPLDEPTH"]),
        clean_decimal(row["DRILLDEPTH"]),
        clean_decimal(row["WATERLEVEL"]),

        # 21-22 text
        clean_text(row["TESTDATE"]),
        clean_text(row["TESTTYPE"]),

        # 23 bit
        clean_bit(row["GAMMA"]),

        # 24-25 text
        clean_text(row["LOCALITY"]),
        clean_text(row["POSACC"]),

        # 26-27 numeric
        clean_decimal(row["LATITUDE"]),
        clean_decimal(row["LONGITUDE"]),

        # 28 integer
        clean_int(row["UTM_ZONE"]),

        # 29-30 numeric
        clean_decimal(row["EASTING"]),
        clean_decimal(row["NORTHING"]),

        # 31 bit
        clean_bit(row["ASSESS_ACT"])
    )

    rows.append(values)


# --------------------------------------------------
# IMPORT IN BATCHES
# --------------------------------------------------

batch_size = 1000

for start in range(0, len(rows), batch_size):

    batch = rows[start:start + batch_size]

    try:
        cursor.executemany(insert_sql, batch)
        conn.commit()

        print(
            f"Inserted "
            f"{min(start + batch_size, len(rows))} / "
            f"{len(rows)} records..."
        )

    except Exception as e:

        conn.rollback()

        print("\nIMPORT FAILED")
        print(f"Batch starting at row: {start}")
        print(f"Error: {e}")

        # Show the first row of the failed batch
        print("\nFirst row in failed batch:")
        for i, value in enumerate(batch[0], start=1):
            print(f"{i}: {value!r}")

        cursor.close()
        conn.close()

        raise


# --------------------------------------------------
# FINISH
# --------------------------------------------------

cursor.close()
conn.close()

print("\n================================")
print("Bores import completed.")
print(f"Total records imported: {len(rows)}")
print("================================")