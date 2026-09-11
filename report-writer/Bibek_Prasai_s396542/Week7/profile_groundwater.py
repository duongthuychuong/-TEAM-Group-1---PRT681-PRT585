import geopandas as gpd
import pandas as pd

files = {
    "Bores": "Bores.shp",
    "Groundwater Levels": "Bores_groundwater_level.shp",
    "Water Quality": "Bores_water_quality.shp"
}

for name, file in files.items():

    print("\n" + "=" * 70)
    print(name)
    print("=" * 70)

    gdf = gpd.read_file(file)

    print(f"Rows: {len(gdf):,}")
    print(f"Columns: {len(gdf.columns)}")

    # ---------------------------------------------------------
    # Missing values
    # ---------------------------------------------------------
    print("\nMissing values:")

    missing = gdf.isnull().sum()
    missing = missing[missing > 0].sort_values(ascending=False)

    if len(missing) > 0:
        print(missing.head(20))
    else:
        print("No missing values")

    # ---------------------------------------------------------
    # Duplicate rows
    # ---------------------------------------------------------
    print("\nDuplicate rows:", gdf.duplicated().sum())

    # ---------------------------------------------------------
    # Unique identifiers
    # ---------------------------------------------------------
    if "BORE_NO" in gdf.columns:
        print("\nUnique BORE_NO:", gdf["BORE_NO"].nunique())

    if "UFI" in gdf.columns:
        print("Unique UFI:", gdf["UFI"].nunique())

    # ---------------------------------------------------------
    # Date information
    # ---------------------------------------------------------
    print("\nDate information:")

    for col in ["SAMPLEDATE", "COMMENCE", "CEASE"]:

        if col in gdf.columns:

            values = gdf[col].dropna().astype(str)

            if len(values) > 0:
                print(
                    f"{col}:",
                    "min =", values.min(),
                    "| max =", values.max()
                )

    # ---------------------------------------------------------
    # Categorical fields
    # ---------------------------------------------------------
    print("\nImportant categorical fields:")

    categorical_fields = [
        "STATUS",
        "STATUSCONS",
        "PURPOSE",
        "MONITORED",
        "RISK_CLASS",
        "YIELDCLASS",
        "ACTIVE",
        "MONITOR_TY"
    ]

    for col in categorical_fields:

        if col in gdf.columns:

            print(f"\n{col}:")
            print(
                gdf[col]
                .value_counts(dropna=False)
                .head(15)
            )

print("\n" + "=" * 70)
print("BORE NUMBER MATCHING")
print("=" * 70)

bores = gpd.read_file("Bores.shp")
water = gpd.read_file("Bores_water_quality.shp")

bore_numbers = set(
    bores["BORE_NO"]
    .dropna()
    .astype(str)
    .str.strip()
)

water_numbers = set(
    water["BORE_NO"]
    .dropna()
    .astype(str)
    .str.strip()
)

matched = bore_numbers.intersection(water_numbers)

print("Unique BORE_NO in Bores:", len(bore_numbers))
print("Unique BORE_NO in Water Quality:", len(water_numbers))
print("Matching BORE_NO:", len(matched))

if len(water_numbers) > 0:

    print(
        "Water Quality match rate:",
        f"{len(matched) / len(water_numbers) * 100:.2f}%"
    )

# -------------------------------------------------------------
# UFI matching
# -------------------------------------------------------------
groundwater = gpd.read_file("Bores_groundwater_level.shp")

bore_ufi = set(bores["UFI"].dropna())
water_ufi = set(water["UFI"].dropna())
groundwater_ufi = set(groundwater["UFI"].dropna())

print("\n" + "=" * 70)
print("UFI MATCHING")
print("=" * 70)

print("Bores UFI:", len(bore_ufi))
print("Water Quality UFI:", len(water_ufi))
print("Groundwater Levels UFI:", len(groundwater_ufi))

print(
    "Water Quality UFI matches:",
    len(bore_ufi.intersection(water_ufi))
)

print(
    "Groundwater Levels UFI matches:",
    len(bore_ufi.intersection(groundwater_ufi))
)

print("\nDone.")