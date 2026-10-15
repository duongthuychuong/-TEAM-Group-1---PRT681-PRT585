# Week 3 — Salary and Benefits Comparison Guide

The accompanying CSV opens in Excel and provides safe column headings for comparing advertisements. It contains an explicitly labelled example row, not a real offer or current market claim.

## Suggested calculations in Excel

Assumptions must be stated for every comparison.

- Hourly base rate: `Annual Base Salary / Paid Hours Per Year`.
- Employer super: `Annual Base Salary * Super Rate` when salary is exclusive of super.
- Annual leave value: `Hourly Base Rate * Annual Leave Hours`.
- Sick/personal leave value: `Hourly Base Rate * Sick Leave Hours`; treat carefully because unused leave may not be paid out.
- Approximate total package: base + employer super + separately valued benefits. Avoid double-counting paid leave if it is already part of annual salary.

## Important interpretation rules

1. Confirm whether advertised remuneration includes or excludes superannuation.
2. Convert contract daily/hourly rates using realistic billable weeks, unpaid leave and insurance/administration costs.
3. Do not treat all benefits as cash-equivalent.
4. Record source URL and access date because advertisements change.
5. Compare role fit, development, flexibility, location and security—not salary alone.

## Data-quality checks

- Salary and hours are non-negative numbers.
- Super rate is stored consistently as a percentage.
- Leave units are consistent before calculation.
- Missing values remain blank/unknown rather than zero unless zero is confirmed.
- Notes identify inclusive/exclusive super and contract assumptions.
