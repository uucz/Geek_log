# Geek_log 改进计划 v2

## 阶段一：深入分析仓库 ✅ 已完成
- [x] 克隆仓库，分析结构（191门课程，7523个HTML文件）
- [x] 理解文件格式、命名规则、课程分类
- [x] 记录分析结果到 ANALYSIS.md

## 阶段二：前端页面重新设计 ✅ 已完成

### 设计参考
参照 cangyou CRM 的 DESIGN.md 美学规范（Warm Minimal / Anthropic 风格）。

### 已完成的设计改进

#### 2.1 色彩体系 ✅
- [x] 背景色：冷灰 `#f5f5f5` → 暖白 `#faf9f5`
- [x] 5 层表面层级体系（surface-0 到 surface-4）
- [x] 品牌色：蓝色 `#1a73e8` → 暖橙 `#d97757`
- [x] 边框：实色 → 半透明 `rgba(20,20,19,.1)`
- [x] 语义色：警告黄、危险红、成功绿

#### 2.2 排版系统 ✅
- [x] 标题：Poppins 无衬线体（中文回退苹方）
- [x] 正文：Lora 衬线体（中文回退思源宋体）
- [x] 字号层级：标题 1.45rem → 正文 0.88rem → 标签 0.62rem
- [x] 标签文字：letter-spacing 0.03-0.1em

#### 2.3 图标系统 ✅
- [x] 搜索图标：emoji 🔍 → SVG 线条图标
- [x] 主题切换：emoji ☀☾ → SVG sun/moon 图标
- [x] 导航箭头：HTML entity → SVG arrowLeft/arrowRight
- [x] 课程图标：新增 SVG book 图标
- [x] 首页图标：新增 SVG home 图标
- [x] 所有 SVG：strokeWidth 1.5, fill none, stroke currentColor, linecap/linejoin round

#### 2.4 交互效果 ✅
- [x] 卡片 hover：box-shadow 变化 → 仅 border-color 微变（橙色微光）
- [x] 按钮 hover：背景色微变 + border 变化
- [x] 侧边栏激活态：左侧 3px 橙色指示条 + 橙色半透明背景

#### 2.5 动效系统 ✅
- [x] fadeUp 入场动画（translateY 12px + 透明度）
- [x] 编排式延迟（每子元素 60ms，最多 5 层）
- [x] 过渡时长：background/color 0.15s，border-color 0.2s

#### 2.6 毛玻璃顶栏 ✅
- [x] backdrop-filter: blur(10px)
- [x] 半透明背景：rgba(250,249,245,.88)
- [x] 高度 60px，sticky 定位

#### 2.7 暗色模式 ✅
- [x] 暖色调暗色背景（`#141413` 而非冷蓝 `#1a1a2e`）
- [x] 手动调校每个颜色的暗色对应值
- [x] 阴影加重（6-8% → 35-45%）
- [x] 半透明度微调

#### 2.8 其他样式改进 ✅
- [x] 滚动条：6px → 5px
- [x] 圆角系统：6px / 10px / 14px 三级
- [x] ::selection 选中色为橙色半透明
- [x] 徽章：低透明度背景（8-12%），小字号，letter-spacing
- [x] 代码块 code 标签：橙色文字 + surface-2 背景

## 阶段三：Bug 修复 ✅ 已完成

### 已修复的问题

#### 3.1 emoji 跨平台不一致 ✅
- [x] 搜索图标：CSS `content: "\1F50D"` → HTML 内联 SVG
- [x] 主题切换按钮：`☀ 亮色` / `☾ 暗色` → SVG sun/moon 图标
- [x] 导航箭头：`&larr;` / `&rarr;` → SVG 箭头图标

#### 3.2 escapeHtml 性能优化 ✅
- [x] 从每次创建新 DOM 元素改为复用单个元素 `_escapeEl`

#### 3.3 页面标题不更新 ✅
- [x] course.html：动态设置 `document.title` 为课程名
- [x] reader.html：动态设置 `document.title` 为章节名 + 课程名

#### 3.4 面包屑分隔符 ✅
- [x] 从简单 `/` 字符改为带样式的 `<span class="sep">/</span>`

#### 3.5 已完结状态显示 ✅
- [x] 课程详情页现在显示"已完结"绿色徽章（而非只显示"未完结"）

#### 3.6 缺少 .gitignore ✅（上一轮已修复）
#### 3.7 缺少 README.md ✅（上一轮已修复）

## 阶段四：功能测试 ✅ 已完成
- [x] index.html 正常加载（HTTP 200）
- [x] courses.json 正确输出（191门课程，7523节课）
- [x] CSS 包含 24 处 brand-orange 引用
- [x] JS 包含 7 处 Icons 引用
- [x] 中文路径 HTML 文件可正确加载（HTTP 200）
- [x] 暗色/亮色主题切换（SVG 图标正确渲染）
- [x] 所有 191 门课程已分类（无"其他"类别）

## 文件清单

| 文件 | 用途 | 状态 |
|------|------|------|
| `build.js` | 构建脚本，生成课程索引 | ✅ |
| `data/courses.json` | 课程元数据索引（191门课程） | ✅ |
| `index.html` | 首页 - 分类浏览 + 搜索 | ✅ 已重新设计 |
| `course.html` | 课程详情 - 章节目录 | ✅ 已重新设计 |
| `reader.html` | 阅读页 - 内容展示 | ✅ 已重新设计 |
| `css/style.css` | 全局样式（Warm Minimal 风格） | ✅ 已重写 |
| `js/app.js` | 核心交互逻辑 + SVG 图标 | ✅ 已重写 |
| `.gitignore` | Git 忽略规则 | ✅ |
| `README.md` | 项目说明文档 | ✅ |
| `ANALYSIS.md` | 仓库分析报告 | ✅ |
| `plan.md` | 改进计划（本文档） | ✅ |

## 使用说明

```bash
# 1. 生成课程索引
node build.js

# 2. 启动本地服务器
python3 -m http.server 8080

# 3. 打开浏览器访问
# http://localhost:8080
```
