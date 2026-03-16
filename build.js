#!/usr/bin/env node
/**
 * 构建脚本：扫描所有课程目录，生成 courses.json 索引文件
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUTPUT = path.join(ROOT, 'data', 'courses.json');

// 需要排除的目录和文件
const EXCLUDE = new Set([
  '.git', '.github', 'node_modules', 'css', 'js', 'data', 'docs',
  '.gitignore', 'LICENSE', 'README.md',
  'build.js', 'index.html', 'course.html', 'reader.html'
]);

// 课程分类映射
const CATEGORIES = {
  '编程语言': [
    'Go', 'Java', 'Python', 'Rust', 'C++', 'C语言', 'Kotlin',
    'JavaScript', 'TypeScript', 'Vim', '编程入门', '编程语言',
    '编译原理', '编程高手', '代码精进', '代码之丑', '正则表达式',
    '程序员工作法', '全栈工程师', '程序员进阶'
  ],
  '数据库': [
    'MySQL', 'Redis', 'SQL', '数据库', 'etcd'
  ],
  '消息队列与中间件': [
    'Kafka', '消息队列', 'RPC'
  ],
  '架构与设计': [
    '架构', '设计模式', 'DDD', '微服务', 'SpringCloud',
    'Spring编程', '分布式', '秒杀系统', '软件设计', '高并发',
    'TDD', '业务建模', 'Tomcat', 'OpenResty'
  ],
  '云原生与DevOps': [
    'Kubernetes', 'Docker', '容器', 'DevOps', 'Serverless',
    'WebAssembly', '云计算', 'eBPF'
  ],
  '前端开发': [
    'React', 'Vue', '浏览器', '重学前端', 'Web框架',
    '可视化', 'Flutter', 'CSS', 'HTML'
  ],
  'Linux与操作系统': [
    'Linux', '操作系统', '计算机组成'
  ],
  '性能优化与测试': [
    '性能优化', '性能调优', '性能工程', '性能测试',
    '全链路压测', '容量保障', '自动化测试', '软件测试',
    '接口测试', 'Spark性能'
  ],
  '网络与安全': [
    '网络协议', '网络编程', '网络排查', 'HTTP', 'OAuth',
    '安全攻防', '密码学', 'Web漏洞', '反爬虫'
  ],
  '大数据与AI': [
    '大数据', '机器学习', '深度学习', 'PyTorch', 'Spark',
    '人工智能', 'AI', '数据处理', '推荐系统', '数据分析',
    '数据结构与算法', '算法', '动态规划', '检索技术', '线性代数'
  ],
  '移动开发': [
    'Android', 'iOS', 'ReactNative', 'Flutter'
  ],
  '技术管理': [
    '技术管理', 'CTO', 'OKR', '项目管理', '技术领导力',
    '晋升', '研发效率', '持续交付', '软件工程', 'SRE',
    '运维体系'
  ],
  '产品与商业': [
    '产品', '增长', '品牌', 'ToB', '广告', '数字化转型',
    '中台', '敏捷', '流程型组织'
  ],
  '综合素养': [
    '写作', '英语', '摄影', '跑步', '音乐', '法律',
    '短视频', '复盘', '学习', '面试', '职场', '财富',
    '访谈', '恋爱', '如何看懂', '如何读懂', '讲好故事',
    '视觉笔记', '用户体验', '体验设计', '去无方向',
    '左耳听风', '编辑训练营'
  ],
  '新兴技术': [
    '区块链', '5G', '芯片', '物联网', '音视频', '即时消息',
    '低代码', '存储', '音频技术', '视频技术', '游戏开发'
  ],
  '技术综合': [
    '技术与商业', 'A-B测试'
  ]
};

function categorize(courseName) {
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    for (const keyword of keywords) {
      if (courseName.includes(keyword)) {
        return category;
      }
    }
  }
  return '其他';
}

function parseLessonInfo(filename) {
  const name = path.basename(filename, '.html');
  const parts = name.split('-');
  const index = parseInt(parts[0], 10);
  // Remove the numeric prefix to get the title
  const title = parts.slice(1).join('-');
  return { index, title, filename: name + '.html' };
}

function scanCourses() {
  const entries = fs.readdirSync(ROOT, { withFileTypes: true });
  const courses = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || EXCLUDE.has(entry.name)) continue;

    const coursePath = path.join(ROOT, entry.name);
    const files = fs.readdirSync(coursePath)
      .filter(f => f.endsWith('.html'))
      .sort((a, b) => {
        const numA = parseInt(a.split('-')[0], 10) || 0;
        const numB = parseInt(b.split('-')[0], 10) || 0;
        return numA - numB;
      });

    if (files.length === 0) continue;

    const isUnfinished = entry.name.includes('未完结');
    const category = categorize(entry.name);

    const lessons = files.map(f => parseLessonInfo(f));

    courses.push({
      name: entry.name,
      directory: entry.name,
      category,
      lessonCount: files.length,
      isUnfinished,
      lessons
    });
  }

  // Sort by category, then by name
  courses.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.name.localeCompare(b.name);
  });

  return courses;
}

function buildIndex() {
  console.log('扫描课程目录...');
  const courses = scanCourses();

  // Build category summary
  const categorySummary = {};
  for (const course of courses) {
    if (!categorySummary[course.category]) {
      categorySummary[course.category] = 0;
    }
    categorySummary[course.category]++;
  }

  const data = {
    totalCourses: courses.length,
    totalLessons: courses.reduce((sum, c) => sum + c.lessonCount, 0),
    categories: categorySummary,
    courses
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`完成！共 ${courses.length} 门课程，${data.totalLessons} 节课`);
  console.log('分类统计：');
  for (const [cat, count] of Object.entries(categorySummary)) {
    console.log(`  ${cat}: ${count} 门`);
  }
}

buildIndex();
