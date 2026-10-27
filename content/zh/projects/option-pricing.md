---
title: BS–XGBoost 混合模型的股指期权定价研究
description: 将经典金融模型与机器学习残差修正相结合，研究沪深300与上证50股指期权定价。
kicker: ASSET PRICING / MACHINE LEARNING
status: 已发表论文 · ICEMGD 2026
visual: option
weight: 1
tags:
- Black–Scholes
- XGBoost
- Python
- 期权定价
stage: undergraduate
outcomes:
- 已发表论文 · ICEMGD 2026
aliases:
- /zh/research/option-pricing/
featured_image: /images/research/option-pricing.svg
featured_image_alt: BS 与 XGBoost 残差修正方法示意
---

## 研究概览

**作者：** 谭立星（Lixing Tan），独立作者。  
**成果：** *Advances in Economics, Management and Political Sciences*，267，181–188，2026 年 5 月 25 日发表。  
**会议：** ICEMGD 2026。

[正式发表页面 ↗](https://aemps.ewapub.com/article/view/33880) · [DOI ↗](https://doi.org/10.54254/2754-1169/2026.33880)

## 研究问题

Black–Scholes（BS）模型提供清晰的理论基准，但固定波动率、忽略交易摩擦等假设难以完整描述现实市场。纯机器学习模型能够拟合非线性关系，但其表现需要通过样本外检验判断。本研究考察：保留 BS 理论基准，再用 XGBoost 修正定价残差，能否改善股指期权定价？

## 我的工作

独立开展研究，在指导下完成文献梳理、数据预处理、特征构建、混合模型实现、实验结果分析与论文写作。主要工作包括将理论定价与残差学习结合，以及比较不同模型和不同在值程度下的预测结果。

## 方法与数据

{{< pipeline >}}

**模型表达：** 混合预测价格 = BS 基准价格 + XGBoost 预测残差。

- **数据来源：** CSMAR 数据库的日度期权行情及相关合约资料。
- **时间划分：** 2023 年用于训练与参数优化，2024 年用于样本外测试。
- **预处理：** 去除零成交量记录，处理无穷值及缺失值，将认购与认沽类型编码。
- **参数选择：** 采用网格搜索及时间序列划分，以均方误差作为评价依据。

### 特征体系

| 类别 | 论文中的特征 |
|---|---|
| 基础合约 | 认购认沽标志、在值程度、剩余期限、无风险利率 |
| 风险敞口 | Delta、Gamma、Vega、Theta、Rho |
| 市场相关变量 | 成交量、持仓量、隐含波动率、历史波动率 |

## 样本外结果

{{< results-chart >}}

| 模型 | MSE | R² |
|---|---:|---:|
| BS 理论模型 | 3846.21 | 0.9625 |
| 纯 XGBoost | 3942.36 | 0.9524 |
| BS + XGBoost | 743.90 | 0.9928 |

来源：论文表 2。混合模型的 MSE 相较 BS 模型下降约 **80.6%**。这些是论文报告的实验结果，并非本网站重新运行得到的结果。

### 不同在值程度

| 分组 | BS 模型 MSE | 混合模型 MSE | 误差降幅 |
|---|---:|---:|---:|
| 实值 ITM | 280.15 | 195.30 | 30.2% |
| 平值 ATM | 3772.38 | 541.96 | 85.6% |
| 虚值 OTM | 150.40 | 120.15 | 20.1% |

来源：论文表 3。平值组报告的改善幅度最大。分组结果对应各自样本，不应直接把不同组的绝对误差作等同比较。

### 上证50检验

论文进一步使用上证50股指期权进行检验（表 4）：BS、纯 XGBoost 和混合模型的 MSE 分别为 **934.50、853.80、514.14**。该结果提供了另一指数样本上的比较，不等同于对所有市场环境的普遍验证。

## 研究边界与后续方向

本研究使用日度数据，不能充分反映盘中价格变化。后续可探索更高频数据、滚动时间窗口评估及不同市场状态下的表现。论文讨论了做市报价、对冲及套利的潜在应用，但当前展示的是定价误差结果，不代表已验证可交易收益。

**指标说明：** 终稿正文部分位置混用了 MSE 与 RMSE，本站统一按表 2—4 的列名使用 MSE。上述数值尚未通过代码复现独立核验。

## 论文与引用

Tan, L. (2026). Stock Index Option Pricing Based on the BS-XGBoost Hybrid Model: Evidence from CSI 300 and SSE 50 Index Options. *Advances in Economics, Management and Political Sciences, 267*, 181–188. https://doi.org/10.54254/2754-1169/2026.33880

{{< citation >}}

论文可通过上方正式发表页面阅读。原始数据受来源许可约束，本站不提供数据下载。
