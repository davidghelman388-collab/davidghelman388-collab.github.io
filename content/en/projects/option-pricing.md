---
title: Stock index option pricing with a BS–XGBoost hybrid model
description: Combining a classical pricing baseline with machine learning residual
  correction for CSI 300 and SSE 50 index options.
kicker: ASSET PRICING / MACHINE LEARNING
status: Published paper · ICEMGD 2026
visual: option
weight: 1
tags:
- Black–Scholes
- XGBoost
- Python
- Option pricing
stage: undergraduate
outcomes:
- Published paper · ICEMGD 2026
aliases:
- /en/research/option-pricing/
featured_image: /images/research/option-pricing.svg
featured_image_alt: BS–XGBoost residual correction concept
---

## Overview

**Author:** Lixing Tan, sole author.  
**Publication:** *Advances in Economics, Management and Political Sciences*, 267, 181–188. Published 25 May 2026.  
**Conference:** ICEMGD 2026.

[Publisher page ↗](https://aemps.ewapub.com/article/view/33880) · [DOI ↗](https://doi.org/10.54254/2754-1169/2026.33880)

## Research question

Black–Scholes (BS) provides a clear theoretical baseline, but fixed volatility and frictionless-market assumptions do not fully describe observed prices. Machine learning can capture nonlinear relationships, but its performance requires out-of-sample evaluation. This study asks whether retaining the BS baseline and learning its residual pricing error with XGBoost can improve index option pricing.

## My contribution

I independently conducted the research, with supervisory guidance, covering literature review, data preprocessing, feature construction, hybrid model implementation, empirical comparisons, and manuscript preparation. The work combines theoretical pricing with residual learning and compares performance across model families and moneyness groups.

## Method and data

{{< pipeline >}}

**Model:** Hybrid predicted price = BS baseline price + XGBoost predicted residual.

- **Source:** CSMAR daily option market data and related contract information.
- **Time split:** 2023 for training and parameter optimization; 2024 for out-of-sample testing.
- **Preprocessing:** Remove zero-volume records, handle infinite and missing values, and encode call/put indicators.
- **Model selection:** Grid search with time-series partitioning and mean squared error evaluation.

### Features

| Category | Features reported in the paper |
|---|---|
| Contract attributes | Call/put indicator, moneyness, time to maturity, risk-free rate |
| Risk exposures | Delta, Gamma, Vega, Theta, Rho |
| Market variables | Volume, open interest, implied volatility, historical volatility |

## Out-of-sample results

{{< results-chart >}}

| Model | MSE | R² |
|---|---:|---:|
| BS theoretical model | 3846.21 | 0.9625 |
| Standalone XGBoost | 3942.36 | 0.9524 |
| BS + XGBoost | 743.90 | 0.9928 |

Source: Table 2 of the paper. The hybrid model reports approximately **80.6% lower MSE** than BS. These are reported study results, not results independently reproduced by this website.

### Moneyness groups

| Group | BS MSE | Hybrid MSE | Error reduction |
|---|---:|---:|---:|
| ITM | 280.15 | 195.30 | 30.2% |
| ATM | 3772.38 | 541.96 | 85.6% |
| OTM | 150.40 | 120.15 | 20.1% |

Source: Table 3. The ATM group reports the largest relative improvement. Each group has its own sample; absolute errors across groups should not be treated as equivalent comparisons.

### SSE 50 evaluation

Table 4 extends the comparison to SSE 50 index options: MSE is **934.50** for BS, **853.80** for standalone XGBoost, and **514.14** for the hybrid model. This is evidence from another index sample, rather than universal validation across market regimes.

## Scope and future work

Daily data cannot fully capture intraday price changes. Further work could consider higher-frequency observations, rolling-window evaluation, and performance across market states. The paper discusses potential uses in market making, hedging, and arbitrage; the reported pricing errors do not establish executable trading returns.

**Metric note:** Some prose in the final manuscript alternates between MSE and RMSE. This page follows the MSE column headings in Tables 2–4. The values have not been independently verified through code reproduction.

## Publication and citation

Tan, L. (2026). Stock Index Option Pricing Based on the BS-XGBoost Hybrid Model: Evidence from CSI 300 and SSE 50 Index Options. *Advances in Economics, Management and Political Sciences, 267*, 181–188. https://doi.org/10.54254/2754-1169/2026.33880

{{< citation >}}

Read the paper through the publisher link above. Source data are subject to licensing restrictions and are not distributed here.
