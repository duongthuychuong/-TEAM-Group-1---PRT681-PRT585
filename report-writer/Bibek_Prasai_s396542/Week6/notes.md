Week 6 — Power BI, DAX, Data Modelling and Dashboard Development

Overview

Week 6 focused primarily on Power BI and turning the SQL Server data into an interactive business intelligence report. The main areas covered were data modelling, Power Query, relationships, DAX measures, calculated tables and dashboard design.

Tools Used

Microsoft Power BI Desktop
SQL Server
SQL Server Management Studio
Power Query
DAX
Tableau
Excel/VBA for additional reporting practice

Importing SQL Server Data

The Superstore Orders table created in SQL Server was connected to Power BI. This provided practical experience of using a database as the source for a BI report.

Once the data was loaded, Power Query could be used to inspect and prepare the dataset. Data preparation is important because inaccurate, inconsistent or poorly structured data can affect calculations and visualisations later in the report.

Data Modelling

A key concept covered was the importance of a proper data model.

Rather than putting every calculation and piece of information into one large table, Power BI can use separate tables for different purposes. For example, the main Orders table contains transactional information, while a separate DateTable contains calendar information.

The relationship was established between the date table and the Orders table. The DateTable provides a consistent calendar structure that can be used for time-based analysis.

This becomes especially important for calculations such as:

Year-to-date sales
Previous year comparisons
Monthly trends
Year-over-year changes
Sales performance over time

Using a dedicated DateTable also makes the model more reliable for time intelligence calculations.

Why Two Tables Were Used

The Orders table is the fact table because it contains individual business transactions such as orders, sales and profit.

The DateTable is a dimension table because it provides descriptive information about dates, such as year, month, quarter and day.

Separating these responsibilities creates a cleaner data model and follows the general principles of a star schema. It also makes DAX calculations easier to maintain and improves the flexibility of the Power BI report.

DAX Measures

DAX (Data Analysis Expressions) was introduced to create calculations inside Power BI.

Measures were created for important business metrics such as:

Total Sales
Total Profit
Total Orders
Profit Margin
YTD Sales
Previous YTD Sales
Sales Percentage Change

For example, a basic sales measure can be created using:

Total Sales = SUM(Orders[Sales])

A profit margin can then be calculated using sales and profit:

Profit Margin = DIVIDE([Total Profit], [Total Sales])

DAX is important because it allows calculations to respond dynamically to filters and selections made by the user. For example, selecting a particular region can automatically change the sales, profit and margin values displayed in the report.

Time Intelligence

Time-based calculations were also explored. The DateTable allowed calculations such as Year-to-Date (YTD) sales and comparisons with previous periods.

YTD calculations help answer questions such as:

How much sales have been generated so far this year?

Comparing current YTD sales with previous YTD sales can then show whether performance has improved or declined.

This is more useful for business reporting than simply displaying a single total because it provides context around performance.

Dashboard Development

The Power BI report was developed using visualisations that allow business users to understand the data quickly.

Key metrics were presented using KPI/card-style visuals, while charts could be used to analyse trends and comparisons across categories, regions and time periods.

The purpose was not simply to make the report visually attractive. Each visual should answer a business question or provide useful information to a stakeholder.

For example:

Cards provide quick performance indicators.
Bar charts allow categories to be compared.
Line charts show trends over time.
Filters/slicers allow users to investigate specific regions, categories or periods.

Tableau

Tableau was also explored as another business intelligence and visualisation platform. The work helped demonstrate that the same underlying business data can be analysed using different BI tools.

Power BI and Tableau both support interactive dashboards, filtering and visual analysis, but they use different interfaces and approaches. Learning both provides a broader understanding of modern reporting and business intelligence tools.

Excel VBA

Basic Excel VBA was also explored for reporting automation. A FormatReport macro was used to demonstrate how repetitive formatting tasks can be automated.

This showed another important aspect of reporting work: automation can reduce manual effort and help produce reports consistently.

Overall Learning from Week 6

The main outcome of Week 6 was understanding the complete path from database → data preparation → data model → calculations → visualisation → business report.

The work demonstrated that creating a good dashboard is not only about choosing charts. The underlying data model, relationships and calculations are equally important.

I also developed a better understanding of the difference between Power Query and DAX. Power Query is primarily used to extract, clean and transform data before or during loading, whereas DAX is mainly used to create calculations and analytical measures within the Power BI model.

Overall, Week 6 strengthened my practical understanding of Power BI and how SQL Server data can be transformed into interactive reports that support business decision-making.