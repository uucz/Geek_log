# Geek_log

极客时间（GeekBang）技术课程笔记合集，附带在线浏览系统。

## 在线浏览

**https://uucz.github.io/Geek_log/**

支持按分类浏览、关键词搜索、暗色模式切换。

## 内容

收录 **191 门** 技术课程笔记，涵盖编程语言、数据库、架构设计、前端后端、大数据与 AI、技术管理等 16 个分类。

## 结构

```
Geek_log/
├── index.html          # 课程浏览首页
├── course.html         # 课程详情页
├── reader.html         # 阅读页面
├── build.js            # 课程索引构建脚本
├── css/                # 样式文件
├── js/                 # 脚本文件
├── data/               # 课程索引数据
├── docs/               # 项目文档
│   ├── ANALYSIS.md     # 仓库分析报告
│   └── plan.md         # 改进计划
├── 课程目录/
│   └── *.html          # 课程内容
└── ...
```

## 本地使用

```bash
node build.js                    # 生成课程索引
python3 -m http.server 8080      # 启动本地服务器
```

## 许可证

MIT License
