import csv
import re

input_file = "Orders.csv"
output_file = "Orders_Fabric_Safe.csv"

new_header = [
    "Row_ID",
    "Order_ID",
    "Order_Date",
    "Ship_Date",
    "Ship_Mode",
    "Customer_ID",
    "Customer_Name",
    "Segment",
    "Country_Region",
    "City",
    "State_Province",
    "Postal_Code",
    "Region",
    "Product_ID",
    "Category",
    "Sub_Category",
    "Product_Name",
    "Sales",
    "Quantity",
    "Discount",
    "Profit"
]

rows = []

with open(input_file, "r", encoding="utf-8-sig", newline="") as infile:
    reader = csv.reader(infile)

    old_header = next(reader)

    for line_number, row in enumerate(reader, start=2):

        if not row or all(cell.strip() == "" for cell in row):
            continue

        if len(row) != 21:
            print(f"Skipping line {line_number}: {len(row)} columns")
            continue

        cleaned = []

        for cell in row:
            cell = re.sub(
                r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]",
                "",
                cell
            )

            cell = cell.replace("\ufeff", "")
            cell = cell.replace("\r", " ")
            cell = cell.replace("\n", " ")
            cell = cell.strip()

            cleaned.append(cell)

        # Convert dates to ISO format
        for index in [2, 3]:

            parts = cleaned[index].split("/")

            if len(parts) == 3:
                month, day, year = parts

                cleaned[index] = (
                    f"{year.zfill(4)}-"
                    f"{month.zfill(2)}-"
                    f"{day.zfill(2)}"
                )

        # IMPORTANT:
        # Product Name is column 17 (index 16)
        # Remove commas and quotation marks so Fabric
        # cannot misinterpret the CSV structure.
        cleaned[16] = cleaned[16].replace(",", " ")
        cleaned[16] = cleaned[16].replace('"', "")
        cleaned[16] = re.sub(r"\s+", " ", cleaned[16]).strip()

        # Remove commas/quotes from ALL text fields
        # except numeric/date values
        for index in range(21):

            if index in [0, 2, 3, 11, 17, 18, 19, 20]:
                continue

            cleaned[index] = cleaned[index].replace(",", " ")
            cleaned[index] = cleaned[index].replace('"', "")

        rows.append(cleaned)


# Write CSV WITHOUT unnecessary quoting
with open(
    output_file,
    "w",
    encoding="utf-8",
    newline=""
) as outfile:

    writer = csv.writer(
        outfile,
        delimiter=",",
        quoting=csv.QUOTE_MINIMAL,
        lineterminator="\n"
    )

    writer.writerow(new_header)

    for row in rows:
        writer.writerow(row)


print()
print("======================================")
print("FABRIC-SAFE CSV CREATED")
print("======================================")
print("Rows:", len(rows))
print("Columns:", len(new_header))
print("Output:", output_file)
print()
print("Product-name commas removed")
print("Quotation marks removed")
print("Dates converted to YYYY-MM-DD")
print("Column names made Fabric-compatible")