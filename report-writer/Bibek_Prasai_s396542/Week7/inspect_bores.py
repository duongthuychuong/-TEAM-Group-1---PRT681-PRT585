import geopandas as gpd

files = [
    "Bores.shp",
    "Bores_groundwater_level.shp",
    "Bores_water_quality.shp"
]

for file in files:
    print("\n" + "=" * 70)
    print(file)
    print("=" * 70)

    data = gpd.read_file(file)

    print("Rows:", len(data))
    print("\nColumns:")
    for column in data.columns:
        print(" -", column)

    print("\nFirst 3 rows:")
    print(data.head(3).to_string())

    print("\nData types:")
    print(data.dtypes)