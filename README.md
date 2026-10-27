# 谭立星个人网站

使用同学授权的 CareerCanvas 模板，保留原布局、圆形头像、GSAP 背景动画、项目卡片、个人信息面板、经历时间线与深浅色切换。网站支持中文和英文。

## 来源与许可

来源：https://github.com/xiong-H6776/xiong-H6776.github.io
来源提交：1ba17f17be715deb6f34570b5f15e2b8e06eb1fe。

同学的授权由用户转达，记录于 TEMPLATE_LICENSE_REVIEW.md。基础主题版权属于 Felipe Cordero，MIT 许可证保留在 themes/careercanvas/LICENSE。第三方依赖和字体许可见 THIRD_PARTY_NOTICES.md。页面页脚保留主题及模板来源署名。

## 本地预览

需要 Hugo 0.168.0、Node.js 及 npm。

1. 首次运行 npm ci --ignore-scripts --no-audit --no-fund。
2. 运行 npm run css 生成原模板的 Tailwind 样式。
3. 运行 hugo server --bind 127.0.0.1 --baseURL http://localhost:1313/ 。
4. 打开 http://localhost:1313/zh/ 或 http://localhost:1313/en/ 。

当前 Codex 环境已有本地工具，可直接运行：

    node node_modules/tailwindcss/lib/cli.js -i themes/careercanvas/assets/css/main.css -o static/css/template.css --minify
    .\.tools\hugo\hugo.exe server --bind 127.0.0.1 --baseURL http://localhost:1313/

需要安装依赖时，当前环境可用 node .tools/npm/package/bin/npm-cli.js ci --ignore-scripts --no-audit --no-fund。

## 修改内容

- hugo.toml：姓名、邮箱、GitHub、简介、语言导航、公开简历链接。
- content/zh/ 与 content/en/：双语内容，使用相同路径即可保持页面翻译对应。
- about/_index.md：个人介绍、教育背景、兴趣及个人信息面板。
- experience/_index.md：时间线数据及完整经历与荣誉内容。
- projects/：两个研究项目的正文、标签、方法与结果。
- research/publications.md：近期成果和正式论文入口。
- technical/_index.md：工具图标分组。
- static/images/portrait.jpg：本人指定的一寸证件照。
- static/files/：公开版中英文单页 PDF 简历，修改正文后需要单独更新 PDF。

改动布局中的 Tailwind 类名后，重新运行 npm run css。Hugo 本身不再调用 PostCSS；预编译 CSS 可直接供普通 Hugo 构建。

## 样式与动画

themes/careercanvas/ 保留原主题；layouts/ 为同学的覆盖实现和本站适配。static/css/template.css 为构建结果，static/css/personal.css 仅适配本人研究图表、头像裁切和动效控制。原 GSAP 动画脚本不替换为本站旧版本的 Canvas 背景。

GSAP、字体、图标均使用本地文件。没有启用 Pexels 图片 API 或 FsLightbox，没有复制同学的私人素材或密钥。暂停按钮及系统减少动态效果设置可控制原 GSAP 动画。

## 验证

当前 Windows/Codex 环境运行 node scripts/verify-classmate.cjs，检查双语主页面、原模板动画及暂停、系统减少动态效果、手机/平板布局、语言切换、深浅色、引用复制和图像资源。测试使用已安装 Edge 与 Codex 内置 Playwright，迁移到其他电脑时需调整脚本依赖路径。截图存入 tmp/qa/，不提交。

旧版验证脚本 verify.cjs、verify-design.cjs 面向之前的自制模板，不能作为当前模板的验收入口。

## GitHub Pages

已配置 .github/workflows/hugo.yaml：安装锁定 Node 依赖、编译 Tailwind、构建 Hugo，然后部署 Pages。尚未创建或推送远端仓库，也未对外发布。

目标地址：https://davidghelman388-collab.github.io/ 。在该账号创建同名仓库后，将 Pages Source 设为 GitHub Actions。

## 备份与公开资料

迁移前的网站保存在 .tools/backup-before-careercanvas/，不提交到 GitHub。原始身份证、完整成绩单、推荐信、受限研究数据、私人电话和住址未加入公开网站。研究图表来自本人论文终稿的表格，指标按原表使用 MSE；正文混用 MSE/RMSE 的情况已在项目页解释。
