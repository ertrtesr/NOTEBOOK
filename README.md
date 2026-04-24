# Notebook

<div align="center">

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Enabled-green?logo=supabase)

**简洁优雅的在线笔记应用，支持 Markdown 编辑与实时预览**

</div>

## 功能特性

| 特性 | 说明 |
|------|------|
| 用户认证 | Supabase Auth，支持邮箱注册登录 |
| Markdown 编辑 | CodeMirror 6，提供语法高亮 |
| 实时预览 | 分屏布局，左编辑右预览 |
| 自动保存 | 900ms 防抖，实时同步到云端 |
| 全文搜索 | 快速检索笔记标题和内容 |
| 响应式布局 | 适配桌面端和移动端 |
| 数据隔离 | Supabase RLS，确保用户数据安全 |

## 技术栈

### 前端框架
- **React 18** - UI 库
- **TypeScript 5** - 类型安全
- **Vite 6** - 极速构建工具
- **Tailwind CSS 3** - 原子化 CSS
- **Headless UI** - 无样式组件库

### 状态与路由
- **Zustand 5** - 轻量状态管理
- **React Router v7** - 客户端路由

### 编辑器
- **CodeMirror 6** - 现代代码编辑器
- **@uiw/react-codemirror** - React 封装

### Markdown
- **react-markdown** - Markdown 渲染
- **remark-gfm** - GitHub 风格表格支持

### 后端服务
- **Supabase** - PostgreSQL + Auth + Storage + RLS

## 快速开始

<details>
<summary>环境要求</summary>

- Node.js >= 18
- npm / yarn / pnpm

</details>

```bash
# 1. 克隆项目
git clone https://github.com/your-username/NOTEBOOK.git
cd NOTEBOOK

# 2. 安装依赖
npm install

# 3. 配置 Supabase
# 创建 .env 文件
cp .env.example .env
# 填写你的 Supabase URL 和 Anon Key

# 4. 运行项目
npm run dev
```

访问 http://localhost:5173 即可使用。

## 项目架构

```
src/
├── components/          # React 组件
│   ├── Auth.tsx        # 认证组件
│   ├── NoteEditor.tsx  # Markdown 编辑器
│   ├── NoteList.tsx    # 笔记列表
│   ├── NotePreview.tsx # 预览面板
│   ├── SearchBar.tsx   # 搜索栏
│   └── Sidebar.tsx     # 侧边栏
├── hooks/              # 自定义 Hooks
│   └── useNotes.ts     # 笔记数据管理
├── pages/              # 页面组件
│   ├── Home.tsx        # 首页
│   ├── Login.tsx       # 登录页
│   └── Register.tsx     # 注册页
├── stores/             # Zustand 状态库
│   └── authStore.ts    # 认证状态
├── types/              # TypeScript 类型
│   └── note.ts         # 笔记类型定义
├── lib/                # 工具库
│   └── supabase.ts     # Supabase 客户端
└── App.tsx             # 根组件
```

## 数据库设计

### notes 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 所属用户 |
| title | text | 笔记标题 |
| content | text | Markdown 内容 |
| created_at | timestamptz | 创建时间 |
| updated_at | timestamptz | 更新时间 |

### RLS 策略

```sql
-- 仅允许用户访问自己的笔记
CREATE POLICY "Users can only access their own notes"
ON notes FOR ALL
USING (auth.uid() = user_id);
```

## 设计规范

### 颜色系统

| 用途 | 颜色 |
|------|------|
| Primary | #3B82F6 (blue-500) |
| Secondary | #6366F1 (indigo-500) |
| Success | #10B981 (emerald-500) |
| Warning | #F59E0B (amber-500) |
| Error | #EF4444 (red-500) |
| Background | #F9FAFB (gray-50) |
| Surface | #FFFFFF |
| Text Primary | #111827 (gray-900) |
| Text Secondary | #6B7280 (gray-500) |

### 字体

- **sans**: Inter, system-ui, sans-serif
- **mono**: JetBrains Mono, Menlo, monospace

### 响应式断点

| 断点 | 宽度 |
|------|------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |

## 开发规范

### 代码风格

- 使用 ESLint + Prettier
- 组件采用 PascalCase 命名
- Hooks 以 use 开头
- 类型定义使用 TypeScript interface

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

## 开发路线图

### 已完成 ✅

- [x] 用户认证系统
- [x] Markdown 编辑器
- [x] 实时预览
- [x] 自动保存
- [x] 笔记列表
- [x] 搜索功能
- [x] 响应式布局

### 进行中 🚧

- [ ] 标签分类
- [ ] 收藏功能
- [ ] 导出功能

### 待开发 📋

- [ ] 笔记分享
- [ ] 深色模式
- [ ] 快捷键支持
- [ ] 移动端优化

---

<div align="center">

Made with ❤️ using React + Supabase

</div>
