// WEEK 4 - POWER QUERY (M) PRACTICE
// Paste into Power BI / Excel Power Query Advanced Editor and update the file path.
let
    Source = Excel.Workbook(File.Contents("C:\Data\Sales.xlsx"), null, true),
    SalesSheet = Source{[Item="Sales_Data",Kind="Sheet"]}[Data],
    PromotedHeaders = Table.PromoteHeaders(SalesSheet, [PromoteAllScalars=true]),
    ChangedTypes = Table.TransformColumnTypes(PromotedHeaders,{
        {"OrderID", Int64.Type}, {"OrderDate", type date}, {"Customer", type text},
        {"Product", type text}, {"Region", type text}, {"Quantity", Int64.Type},
        {"UnitPrice", type number}, {"UnitCost", type number}
    }),
    TrimmedText = Table.TransformColumns(ChangedTypes,{
        {"Customer", Text.Trim, type text}, {"Product", Text.Trim, type text}, {"Region", Text.Proper, type text}
    }),
    RemovedBlankRows = Table.SelectRows(TrimmedText, each [OrderID] <> null and [Product] <> null),
    RemovedDuplicates = Table.Distinct(RemovedBlankRows, {"OrderID"}),
    AddedSales = Table.AddColumn(RemovedDuplicates, "Sales", each [Quantity] * [UnitPrice], type number),
    AddedProfit = Table.AddColumn(AddedSales, "Profit", each [Quantity] * ([UnitPrice] - [UnitCost]), type number)
in
    AddedProfit
