# 同学网站模板使用许可核查

核查时间：2026-10-27。

## 当前结论（授权后更新）

用户已转达同学回复：“没事儿，你随便用”，对应此前复制、修改、发布至个人网站与 GitHub 仓库的使用请求。定制代码的迁移已据此完成，无需重复确认。原主题 MIT 许可、第三方版权及来源说明均已保留，详见 `THIRD_PARTY_NOTICES.md`。GSAP 已核对官方 Standard No Charge License；本网站的普通页面动画用途在其允许范围内。Font Awesome 字体与 CSS、Google Fonts 字体、Devicon 图标均保留各自许可。

模板源码提交为 `1ba17f17be715deb6f34570b5f15e2b8e06eb1fe`，已在本地替换用户资料并进行构建与浏览器验证。当前版本已于 2026-10-27 发布到 https://davidghelman388-collab.github.io/ ，通过 GitHub Actions 构建部署。下文是授权前的核查记录，其中“等待确认”状态已由本节更新。

来源仓库：https://github.com/xiong-H6776/xiong-H6776.github.io ，main 分支。

本次 GitHub 递归目录响应未截断，快照 tree SHA 为 `1ba17f17be715deb6f34570b5f15e2b8e06eb1fe`。检查结果与以下链接所指当前文件一致；之后上游可能更新。

## 已确认的许可

`themes/careercanvas/LICENSE` 明确为 MIT，版权人为 Felipe Cordero，年份 2024。其 README 和 theme.toml 也指向 CareerCanvas 原主题及 MIT 许可。

MIT 允许使用、复制、修改和分发，要求在副本或实质部分中保留原版权及许可声明。迁移时须原样保留该 LICENSE，不能把作者改成谭立星。

- https://github.com/xiong-H6776/xiong-H6776.github.io/blob/main/themes/careercanvas/LICENSE
- https://github.com/xiong-H6776/xiong-H6776.github.io/blob/main/themes/careercanvas/README.md
- https://github.com/xiong-H6776/xiong-H6776.github.io/blob/main/themes/careercanvas/theme.toml

## 根目录定制代码

根目录 `package.json` 标注 `"license": "ISC"`，应记录为已有许可声明，不应称整个仓库“没有许可证”。但根目录未发现 LICENSE、COPYING 或 NOTICE，也未找到自定义模板的独立许可范围与作者署名说明。GitHub 仓库元数据 `license: null` 与主题子目录 MIT 并不矛盾，也不推翻 package.json 中的 ISC 声明。

根目录 `layouts/` 和 `assets/` 共 17 个文件，含同学首页、代表成果、项目列表/详情、博客、证书及脚本的覆盖实现。要忠实保留同学当前网站的布局，需要使用这些覆盖文件，不能只装原始 CareerCanvas 就称为相同模板。

已向用户请求同学确认：允许复制、修改、公开部署及提交到用户个人 GitHub 仓库的范围，以及希望保留的署名。确认信息应保留在本项目授权记录中。现阶段未把这些定制文件写入当前网站，也未覆盖现有设计。

- https://github.com/xiong-H6776/xiong-H6776.github.io/blob/main/package.json
- https://github.com/xiong-H6776/xiong-H6776.github.io/tree/main/layouts
- https://github.com/xiong-H6776/xiong-H6776.github.io/tree/main/assets

## 动效与第三方素材

- 动画入口为主题目录中的 `assets/js/gsap-animations.js`，会动态加载 GSAP 3.13.0；主题的 MIT 不自动替代 GSAP 库自己的许可。
- `pexels-background.js` 具有 Pexels 图片背景功能。源配置 `pexelsapikey` 为空，未发现用户需要继承的 API 凭据。迁移不复制他人的密钥；动态几何与背景图片功能需分别验收，不能声称空配置已启用图片轮换。
- head/base 模板还引用 Font Awesome、Devicon、FsLightbox 等外部资源，迁移时需逐项保留其所需的许可/署名。尚未完成这些依赖的逐项许可验收，不能宣称整个依赖链均为 MIT。
- 不复制同学的头像、简历、论文、成绩单、证书及研究数据。它们不因代码许可而成为本人的网站资料。

## 内容迁移清单

| 同学模板区域 | 谭立星资料 | 实施注意 |
|---|---|---|
| 圆形头像与个人简介 | 一寸证件照、金融工程/金融学/数据科学方向 | 保留模板的布局和动画标记，替换姓名、邮箱和 GitHub |
| 代表项目 | 期权定价论文、量化投资研究 | 使用本人现有中英文项目页，保留 DOI 和指标说明 |
| 近期成果 | AEMPS 267, 181–188 已发表论文 | 不沿用同学的录用状态或作者信息 |
| 教育与经历时间线 | 大连理工、厦门大学交流、三段实习 | 以已有核对资料替换 |
| 工具与技术 | Python、EViews、SPSS、NumPy、pandas、Matplotlib、GitHub、Jupyter | 不继承同学的工程工具或能力声明 |
| 简历入口 | 本人公开版中英文单页 PDF | 保留下载入口，不复制源仓库简历 |
| 证书与博客 | 只展示已有真实内容 | 无实际内容的栏目先不展示 |
| 联系与个人介绍 | tanlixing27@163.com、本人 GitHub、足球与唱歌 | 不继承对方城市、账号或社交链接 |

下一步在确认定制代码授权后，先备份当前站点，再导入经过审核的主题和覆盖文件，适配 Hugo/Tailwind 构建与现有双语内容，最后验证桌面/手机、深浅色、动态背景和全部链接。未对外发布。
