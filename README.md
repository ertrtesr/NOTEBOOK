# 在线笔记应用

一个简洁的在线笔记应用，支持 Markdown 编辑和实时保存。

## 技术栈

- 前端：React 18 + TypeScript + Vite
- UI 库：Tailwind CSS + Headless UI
- 编辑器：CodeMirror 6
- 后端：Supabase (PostgreSQL + Realtime)
- 部署：Vercel

## 核心功能

1. 用户注册和登录
2. 创建、编辑、删除笔记
3. Markdown 实时预览
4. 笔记自动保存
5. 笔记搜索

## 目录结构

- `/src/components` - React 组件
- `/src/pages` - 页面组件
- `/src/lib` - 工具函数和 API
- `/src/hooks` - 自定义 Hooks
- `/src/types` - TypeScript 类型定义

## 开发规范

- 组件使用函数式组件 + Hooks
- 所有组件必须有 TypeScript 类型
- 样式只用 Tailwind CSS
- API 调用统一使用 `/src/lib/api` 中的函数
- 状态管理使用 Zustand

## 设计风格

- 简约、专业
- 主色调：#6366F1 (Indigo)
- 圆角：6px
- 字体：Inter

## 本地运行

1. 复制 `cp .env.example .env`，填入 Supabase 项目的 URL 与 anon key。
2. 在 Supabase SQL Editor 中执行 `supabase/migrations/001_notes.sql`（启用 `notes` 表与 RLS）。
3. `npm install` 后执行 `npm run dev`，浏览器打开终端提示的本地地址。
4. 生产构建：`npm run build`，预览：`npm run preview`。
