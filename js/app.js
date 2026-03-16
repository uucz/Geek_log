/**
 * Geek_log - 课程浏览系统核心脚本
 * 设计参照：Warm Minimal / Anthropic 风格
 */

/* ---- SVG Icons (line-art, strokeWidth 1.5, fill none) ---- */
const Icons = {
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,

  sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,

  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,

  arrowLeft: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,

  arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,

  book: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,

  home: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
};

/* ---- Shared Utilities ---- */
const _escapeEl = document.createElement('div');
function escapeHtml(str) {
  _escapeEl.textContent = str;
  return _escapeEl.innerHTML;
}

/* ---- App (Index Page) ---- */
const App = {
  data: null,
  currentCategory: '\u5168\u90e8', // 全部

  async init() {
    this.initTheme();
    try {
      const resp = await fetch('data/courses.json');
      this.data = await resp.json();
      this.render();
      this.bindEvents();
    } catch (e) {
      document.querySelector('.main').innerHTML =
        '<div class="empty-state"><p>\u52a0\u8f7d\u8bfe\u7a0b\u6570\u636e\u5931\u8d25\uff0c\u8bf7\u5148\u8fd0\u884c node build.js \u751f\u6210\u7d22\u5f15</p></div>';
    }
  },

  // ---- Theme ----
  initTheme() {
    const saved = localStorage.getItem('geeklog-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    this._updateThemeButton(saved);

    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggleTheme());
    }
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('geeklog-theme', next);
    this._updateThemeButton(next);
  },

  _updateThemeButton(theme) {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? Icons.sun : Icons.moon;
      btn.setAttribute('aria-label', theme === 'dark' ? '\u5207\u6362\u4eae\u8272' : '\u5207\u6362\u6697\u8272');
    }
  },

  // ---- Render ----
  render() {
    if (!this.data) return;

    // Stats
    const stats = document.querySelector('.stats');
    if (stats) {
      stats.textContent = `${this.data.totalCourses} \u95e8\u8bfe\u7a0b \u00b7 ${this.data.totalLessons} \u8282\u8bfe`;
    }

    this.renderCategoryTabs();
    this.renderCourses();
  },

  renderCategoryTabs() {
    const container = document.querySelector('.category-tabs');
    if (!container) return;

    const cats = Object.entries(this.data.categories);
    let html = `<div class="category-tab active" data-cat="\u5168\u90e8">\u5168\u90e8 <span class="count">${this.data.totalCourses}</span></div>`;

    for (const [cat, count] of cats) {
      html += `<div class="category-tab" data-cat="${escapeHtml(cat)}">${escapeHtml(cat)} <span class="count">${count}</span></div>`;
    }

    container.innerHTML = html;
  },

  renderCourses(filter = '') {
    const container = document.querySelector('.course-grid');
    if (!container) return;

    let courses = this.data.courses;

    if (this.currentCategory !== '\u5168\u90e8') {
      courses = courses.filter(c => c.category === this.currentCategory);
    }

    if (filter) {
      const term = filter.toLowerCase();
      courses = courses.filter(c => c.name.toLowerCase().includes(term));
    }

    if (courses.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>\u6ca1\u6709\u627e\u5230\u5339\u914d\u7684\u8bfe\u7a0b</p></div>';
      return;
    }

    container.innerHTML = courses.map(c => `
      <div class="course-card" data-course="${encodeURIComponent(c.directory)}">
        <div class="course-card-title">${escapeHtml(c.name.replace('-\u672a\u5b8c\u7ed3', ''))}</div>
        <div style="margin-bottom:10px">
          <span class="badge badge-category">${escapeHtml(c.category)}</span>
          ${c.isUnfinished ? '<span class="badge badge-unfinished">\u672a\u5b8c\u7ed3</span>' : ''}
        </div>
        <div class="course-card-meta">
          ${Icons.book} <span>${c.lessonCount} \u8282\u8bfe</span>
        </div>
      </div>
    `).join('');
  },

  bindEvents() {
    // Category tabs
    document.querySelector('.category-tabs')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.category-tab');
      if (!tab) return;
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      this.currentCategory = tab.dataset.cat;
      const searchInput = document.querySelector('.search-box input');
      this.renderCourses(searchInput?.value || '');
    });

    // Search
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
      let debounce;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          this.renderCourses(searchInput.value);
        }, 200);
      });
    }

    // Course card click
    document.querySelector('.course-grid')?.addEventListener('click', (e) => {
      const card = e.target.closest('.course-card');
      if (!card) return;
      window.location.href = `course.html?name=${card.dataset.course}`;
    });
  }
};

/* ---- Course Detail Page ---- */
const CoursePage = {
  data: null,
  course: null,

  async init() {
    App.initTheme();
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    if (!name) {
      window.location.href = 'index.html';
      return;
    }

    try {
      const resp = await fetch('data/courses.json');
      this.data = await resp.json();
      this.course = this.data.courses.find(c => c.directory === decodeURIComponent(name));
      if (!this.course) {
        document.querySelector('.main').innerHTML =
          '<div class="empty-state"><p>\u8bfe\u7a0b\u672a\u627e\u5230</p></div>';
        return;
      }
      this.render();
    } catch (e) {
      document.querySelector('.main').innerHTML =
        '<div class="empty-state"><p>\u52a0\u8f7d\u5931\u8d25</p></div>';
    }
  },

  render() {
    const c = this.course;
    const displayName = escapeHtml(c.name.replace('-\u672a\u5b8c\u7ed3', ''));

    // Page title
    document.title = `${c.name.replace('-\u672a\u5b8c\u7ed3', '')} - Geek_log`;

    // Breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `<a href="index.html">${Icons.home} \u9996\u9875</a><span class="sep">/</span>${displayName}`;
    }

    // Header
    const header = document.querySelector('.course-header');
    if (header) {
      header.innerHTML = `
        <div class="course-title">${displayName}</div>
        <div class="course-info">
          <span class="badge badge-category">${escapeHtml(c.category)}</span>
          ${c.isUnfinished ? '<span class="badge badge-unfinished">\u672a\u5b8c\u7ed3</span>' : '<span class="badge badge-complete">\u5df2\u5b8c\u7ed3</span>'}
          <span>${c.lessonCount} \u8282\u8bfe</span>
        </div>
      `;
    }

    // Lesson list
    const list = document.querySelector('.lesson-list');
    if (list) {
      list.innerHTML = c.lessons.map((lesson, i) => `
        <li class="lesson-item">
          <a class="lesson-link" href="reader.html?course=${encodeURIComponent(c.directory)}&lesson=${i}">
            <span class="lesson-num">${String(lesson.index).padStart(2, '0')}</span>
            <span class="lesson-title">${escapeHtml(lesson.title)}</span>
            ${Icons.arrowRight}
          </a>
        </li>
      `).join('');
    }
  }
};

/* ---- Reader Page ---- */
const ReaderPage = {
  data: null,
  course: null,
  lessonIndex: 0,

  async init() {
    App.initTheme();
    const params = new URLSearchParams(window.location.search);
    const courseName = params.get('course');
    this.lessonIndex = parseInt(params.get('lesson') || '0', 10);

    if (!courseName) {
      window.location.href = 'index.html';
      return;
    }

    try {
      const resp = await fetch('data/courses.json');
      this.data = await resp.json();
      this.course = this.data.courses.find(c => c.directory === decodeURIComponent(courseName));
      if (!this.course) {
        document.querySelector('.reader-content').innerHTML =
          '<div class="empty-state"><p>\u8bfe\u7a0b\u672a\u627e\u5230</p></div>';
        return;
      }
      this.renderSidebar();
      this.loadLesson();
    } catch (e) {
      document.querySelector('.reader-content').innerHTML =
        '<div class="empty-state"><p>\u52a0\u8f7d\u5931\u8d25</p></div>';
    }
  },

  renderSidebar() {
    const sidebar = document.querySelector('.reader-sidebar');
    if (!sidebar) return;

    const c = this.course;
    const displayName = escapeHtml(c.name.replace('-\u672a\u5b8c\u7ed3', ''));

    let html = `<div class="sidebar-title"><a href="course.html?name=${encodeURIComponent(c.directory)}">${displayName}</a></div>`;

    html += c.lessons.map((lesson, i) => `
      <a class="sidebar-item ${i === this.lessonIndex ? 'active' : ''}"
         href="reader.html?course=${encodeURIComponent(c.directory)}&lesson=${i}">
        ${escapeHtml(lesson.title)}
      </a>
    `).join('');

    sidebar.innerHTML = html;
  },

  async loadLesson() {
    const content = document.querySelector('.reader-content');
    if (!content) return;

    const lesson = this.course.lessons[this.lessonIndex];
    if (!lesson) {
      content.innerHTML = '<div class="empty-state"><p>\u7ae0\u8282\u672a\u627e\u5230</p></div>';
      return;
    }

    const displayCourseName = escapeHtml(this.course.name.replace('-\u672a\u5b8c\u7ed3', ''));

    // Page title
    document.title = `${lesson.title} - ${this.course.name.replace('-\u672a\u5b8c\u7ed3', '')} - Geek_log`;

    // Breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
      breadcrumb.innerHTML = `<a href="index.html">${Icons.home} \u9996\u9875</a><span class="sep">/</span><a href="course.html?name=${encodeURIComponent(this.course.directory)}">${displayCourseName}</a><span class="sep">/</span>${escapeHtml(lesson.title)}`;
    }

    content.innerHTML = '<div class="loading">\u52a0\u8f7d\u4e2d...</div>';

    try {
      const filePath = `${encodeURIComponent(this.course.directory)}/${encodeURIComponent(lesson.filename)}`;
      const resp = await fetch(filePath);
      if (!resp.ok) throw new Error('fetch failed');
      let html = await resp.text();

      // Remove read_end markers
      html = html.replace(/<!-- \[\[\[read_end\]\]\] -->/g, '');

      content.innerHTML = `
        <div class="article-title">${escapeHtml(lesson.title)}</div>
        <div class="article-body">${html}</div>
        ${this.renderNav()}
      `;

      // Scroll sidebar active item into view
      const activeItem = document.querySelector('.sidebar-item.active');
      if (activeItem) activeItem.scrollIntoView({ block: 'center', behavior: 'smooth' });

      window.scrollTo(0, 0);
    } catch (e) {
      content.innerHTML = `<div class="empty-state"><p>\u65e0\u6cd5\u52a0\u8f7d\u8bfe\u7a0b\u5185\u5bb9\uff1a${escapeHtml(lesson.filename)}</p></div>`;
    }
  },

  renderNav() {
    const lessons = this.course.lessons;
    const prev = this.lessonIndex > 0 ? this.lessonIndex - 1 : null;
    const next = this.lessonIndex < lessons.length - 1 ? this.lessonIndex + 1 : null;
    const courseParam = encodeURIComponent(this.course.directory);

    return `
      <div class="reader-nav">
        ${prev !== null
          ? `<a href="reader.html?course=${courseParam}&lesson=${prev}">${Icons.arrowLeft} \u4e0a\u4e00\u8282</a>`
          : '<span></span>'}
        ${next !== null
          ? `<a href="reader.html?course=${courseParam}&lesson=${next}">\u4e0b\u4e00\u8282 ${Icons.arrowRight}</a>`
          : '<span></span>'}
      </div>
    `;
  }
};
